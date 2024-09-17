// @ts-ignore
import { startStandaloneServer } from "@apollo/server/standalone";
import config from "./_confs/config.js";
import getGraphqlComponents from './src/utils/getGraphqlComponents.js';

const { server, context } = await getGraphqlComponents()

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: config.port },
  // @ts-ignore
  context,
});

console.log(`🚀  Server ready at: ${url}`);
