import { readJson } from "@mmorg/fsutils";
import { entities2graphql, getDataLoader } from "@mmorg/rdfx-graphql";
import { graphql, GraphQLSchema } from "graphql";
import { dirname, join, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import loadWorldGraph from "../_confs/loadWorldGraph.js";
import { getExtraResolver } from "../src/getExtraResolver/getExtraResolver.js";
import { getResolverCallback } from "../src/getResolverCallback.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ontology = readJson(
  resolve(__dirname, "../../../data/finalOntology/final-ontology.ld.json")
);

const loadExtraResolver = async (extraResolverDefs) => {
  return await Promise.all(
    extraResolverDefs.map(async (d) => ({
      ...d,
      resolver: await import(
        pathToFileURL(join(__dirname, "..", d.resolverPath))
      ).then((r) => r.default),
    }))
  );
};
export default async function getDefaultOnlineMakeQuery(elasticConf) {
  const schemaDefinition = entities2graphql(ontology);
  const schema = new GraphQLSchema(schemaDefinition);
  const extraResolverDefs = await loadExtraResolver(getExtraResolver());
  const callbackResolverDefs = await loadExtraResolver(getResolverCallback());
  ontology.graph.push(...extraResolverDefs, ...callbackResolverDefs);
  // this is real online dataLoader
  const worldGraph = loadWorldGraph(ontology);
  const dataLoader = await getDataLoader(elasticConf, ontology, worldGraph);

  const makeQuery = async (query, variables, contextValue) =>
    graphql({
      schema,
      contextValue: { dataLoader, ...contextValue },
      source: query,
      variableValues: variables,
    });

  return makeQuery;
}
