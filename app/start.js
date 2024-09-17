import hapiApollo from '@as-integrations/hapi';
import inert from '@hapi/inert';
import { Server } from '@hapi/hapi';
import getGraphqlComponents from './services/profile-api/src/utils/getGraphqlComponents.js'
// import { serveAddviseo } from './services/profile-api/src/resolvers/addviseo.js';
import spaHttp from './src/spaHttp.js';
import Boom from '@hapi/boom'

const { server, context } = await getGraphqlComponents()

console.log('Start Apollo')
await server.start()
console.log('Start Hapi ; Apollo started')


const host = '0.0.0.0' //'localhost' // '127.0.0.1'
const port = '8080' //config.port
// create the hapi server
const hapi = new Server({
  host,
  port,
  // debug: { request: ['*'] }
});

// graphql : register Hapi publish to the http:server need graphql server & context
// inert : register this plugin `directory` handler needed for SPA
await hapi.register(
  [
    {
      plugin: hapiApollo.default,
      options: {
        path: '/graphql',
        apolloServer: server,
        context,
      },
    },
    inert,
  ]
);

const homepage = () => {
  const httpDirPath = ''
  const nodeDirPath = `services/homepage`
  spaHttp(hapi, httpDirPath, nodeDirPath)
}
homepage()

const admin = () => {
  const httpDirPath = 'admin'
  const nodeDirPath = `services/admin-ui`
  spaHttp(hapi, httpDirPath, nodeDirPath)
}
admin()

const profile = () => {
  const httpDirPath = 'profile'
  const nodeDirPath = `services/profile`
  spaHttp(hapi, httpDirPath, nodeDirPath)
}
profile()


await hapi.start();
console.log(`🚀  Server ready at: ${hapi.info.uri}/`);
