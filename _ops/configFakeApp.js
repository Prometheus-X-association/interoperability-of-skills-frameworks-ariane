import { buildable, copyable, deployable } from './src/deployType-utils.js';

const config = {
  app: {
    path: 'fake-app',
    name: 'fake-app', 
    services: [
      // {
      //   name: 'fake-app',
      //   deployType: buildable
      // },
      // {
      //   name: 'profile-api',
      //   deployType: deployable,
      //   conf: {
      //     // @TODO: define the decrypt config
      //   }
      // },
      // {
      //   name: 'profile',
      //   deployType: buildable,
      // },
      // {
      //   name: 'admin-ui',
      //   deployType: buildable
      // },

    ]
  },
  env: {
    path: '_ops/_env'
  },
  image: {
    registryPath: `europe-west1-docker.pkg.dev/ariane-develop/ariane-docker-repos`,
    path: `fake-app`
  },
  google:{
    project: 'ariane-develop'
  },
  build: {
    testLocal: true,
  },
  out: {
    envVar: `_ops/_temp/env_vars`,
    deploy: `_ops/_temp/deploy_asset`,
  },
  skip: {
    // installApp: true,
    // e2eLocal: true,
    // dockerBuild: true,
    // e2eDocker: true,
    // publishApp: true,
  }
}
export default config;
