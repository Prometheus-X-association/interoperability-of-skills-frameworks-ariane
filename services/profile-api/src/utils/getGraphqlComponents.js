// @ts-ignore
import { ApolloServer } from "@apollo/server";
import { entities2graphql, getDataLoader } from "@mmorg/rdfx-graphql";
import ontology from "final-ontology";
// @ts-ignore
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} from "graphql";
import { dirname, join } from "path";
import activate from "../resolvers/activate.js";
import signup from "../resolvers/signup.js";
import { updateReport } from "./updateReport.js";
import { fileURLToPath, pathToFileURL } from "url";
import config from "../../_confs/config.js";
import loadWorldGraph from "../../_confs/loadWorldGraph.js";
import { getExtraResolver } from "../getExtraResolver/getExtraResolver.js";
import { getResolverCallback } from "../getResolverCallback.js";
import { validateOffline } from "../keycloak/validateOffline.js";
import { authorize } from "../resolvers/authorize.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// @TODO: get this config from the config.yml file
const throttleConf = {
  // this is "dev" config that fall when missions import
  limit: 2, // 4 make dev instance fall
  interval: 1000,
  docsCount: 50, // default limits = max 100 documents per request but also 235.7mb size max. So make it low until a dynamic size calculation before send.
  showLogs: true,
};

const loadExtraResolver = async (extraResolverDefs) => {
  return await Promise.all(
    extraResolverDefs.map(async (d) => ({
      ...d,
      resolver: await import(
        pathToFileURL(join(__dirname, "../..", d.resolverPath))
      ).then((r) => r.default), // TODO make sure this pathToFileURL works properly in other environment
    }))
  );
};

export default async function getGraphqlComponents() {
  const extraResolverDefs = await loadExtraResolver(getExtraResolver());
  const callbackResolverDefs = await loadExtraResolver(getResolverCallback());
  ontology.graph.push(...extraResolverDefs, ...callbackResolverDefs);
  // console.log('extraResolvers', extraResolverDefs)
  // @TODO: clean the dataLoaderImplementation
  const worldGraph = loadWorldGraph(ontology);
  const dataLoader = await getDataLoader(config.elastic, ontology, worldGraph, {
    throttleConf,
  });

  const schemaDefinition = entities2graphql({
    ld: ontology,
    extra: {
      // TODO: Update ismene to be extraMutation instead
      extraQueries: {
        SignUp: {
          type: new GraphQLObjectType({
            name: "SignUp",
            fields: {
              // accessToken: {
              //   type: GraphQLString,
              // },
              userId: {
                type: GraphQLString,
              },
            },
          }),
          args: {
            username: {
              type: new GraphQLNonNull(GraphQLString),
            },
            company: {
              type: new GraphQLNonNull(GraphQLString),
            },
            firstName: {
              type: new GraphQLNonNull(GraphQLString),
            },
            lastName: {
              type: new GraphQLNonNull(GraphQLString),
            },
            email: {
              type: new GraphQLNonNull(GraphQLString),
            },
            directManager: {
              type: new GraphQLNonNull(GraphQLString),
            },
          },
          resolve: async (_, args, context, info) => {
            const { initialPassword, userId } = await signup(
              _,
              args,
              context,
              info
            );
            // Create user in db

            // TODO: do something to send email with initialPassword to user to activate account

            return { userId };
          },
        },
        ActivateUser: {
          type: new GraphQLObjectType({
            name: "ActivateUser",
            fields: {
              userId: {
                type: GraphQLString,
              },
            },
          }),
          args: {
            token: {
              type: new GraphQLNonNull(GraphQLString),
            },
          },
          resolve: activate,
        },
      },
    },
    dataLoader,
  });

  schemaDefinition.query = new GraphQLObjectType({
    ...schemaDefinition.query.toConfig(),
    fields: {
      ...schemaDefinition.query.toConfig().fields,
    },
  });

  const schema = new GraphQLSchema(schemaDefinition);

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async requestDidStart(requestContext) {
          const startTime = new Date().getTime();
          return {
            async willSendResponse(requestContext) {
              if (requestContext.operationName === "IntrospectionQuery") {
                return;
              }
              if (!requestContext.errors?.length) {
                await updateReport(requestContext);
              }
              // try {
              //   const endTime = new Date().getTime();
              //   const rawReq = requestContext.contextValue.req;
              //   const log = {
              //     id:
              //       requestContext.queryHash ??
              //       `${randomString()}-${randomString()}`,
              //     req_operation__value: requestContext.operationName,
              //     req_source__value:
              //       typeof requestContext.source === "string"
              //         ? requestContext.source
              //         : JSON.stringify(requestContext.source),
              //     req_variables__value: JSON.stringify(
              //       requestContext.request.variables,
              //     ),
              //     req_duration__value: (endTime - startTime) / 1000,
              //     req_start_time__value: new Date(startTime).toISOString(),
              //     req_end_time__value: new Date(endTime).toISOString(),
              //     req_ip__value: rawReq?.ip || rawReq?.socket?.remoteAddress,
              //     req_origin__value:
              //       requestContext.request?.http?.headers?.get("origin"),
              //     is_auto_logged: "true",
              //   };
              //   engineClient.indexDocuments({
              //     engine_name: "5-min-logging",
              //     documents: [log],
              //   });
              //   // if (indexRes.find?.((i) => i.errors?.length)) {
              //   //   console.error(indexRes);
              //   // }
              // } catch (e) {
              //   console.error(e);
              // }
            },
          };
        },
      },
    ],
  });

  const context = async (ctxParam) => {
    // @TODO: check why this changed betwee `.req` and `.request` and update .res accordingly
    const req = ctxParam.req ?? ctxParam.request;
    const res = ctxParam.res;

    const token = req?.headers?.authorization?.replace("Bearer ", "");
    const isAdminSite = req?.headers?.["x-admin-site"] === "myAdmin";
    let authObject;
    try {
      authObject = token ? validateOffline(token) : null;
    } catch (e) {
      // Currently we don't want to throw error at root level, so we just keep log
      authObject = null;
    }
    return {
      req,
      res,
      dataLoader,
      authObject,
      isAdminSite,
      authorize: authorize(authObject),
      playground: true,
    };
  };

  return {
    server,
    context,
  };
}
