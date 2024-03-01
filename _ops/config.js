import { buildable, copyable, deployable } from './src/deployType-utils.js';

const config = {
  app: {
    path: 'app',
    name: 'jobsong', 
    services: [
      {
        name: 'homepage',
        deployType: buildable
      },
      {
        name: 'profile-api',
        deployType: deployable,
        conf: {
          // @TODO: define the decrypt config
        }
      },
      {
        name: 'profile',
        deployType: buildable,
      },
      {
        name: 'admin-ui',
        deployType: buildable
      },

    ]
  },
  env: {
    path: '_ops/_env'
  },
  image: {
    registryPath: `europe-west1-docker.pkg.dev/jobsong-dev/jobsong-images`,
    path: `jobsong/app`
  },
  build: {
    testLocal: true,
  },
  out: {
    envVar: `_ops/_temp/env_vars`,
    deploy: `_ops/_temp/deploy_asset`,
  },
  skip: {
    // publishDep: true,
    // installApp: true,
    // deployService: true,
    // e2eLocal: true,
    // dockerBuild: true,
    e2eDocker: true,
    // publishApp: true,
  }
}
export default config;
