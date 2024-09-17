import { saveMap } from '@mmorg/fsutils'
import chalk from 'chalk'
import { $, execa } from 'execa'
import { root } from './src/git-utils.js'
import checkDepList from './src/checkDepList.js'
import { getDepList } from './src/dep-utils.js'
import { stoppable } from './src/execa-utils.js'
import config from './config.js'
import { publishTree } from './src/publish-utils.js'
import iValidate from './src/iValidate.js'

// cd _ops/
// node deploy.js

/* !! Warn : login check and authentification is out of script !!
# preliminary docker config, authentication and project setup
gcloud auth configure-docker europe-west1-docker.pkg.dev
gcloud auth login
gcloud config set project jobsong-dev
*/

// @TODO: remove 'projectRoot' variable
const projectRoot = '..'
const workspaceRoot = await root()


const conf = config

let branchName = 'dev'
// should be a name for the production environnemnt 
// // @TODO: create a test on the branchname and make it dynamic
branchName = `devonline`

// @TODO: do the same "dynamic-env" building as branchName
let envName = 'dev'

// execa command configuration to get script's output
const c = $({ stdio: 'inherit' })

const path_app = `${workspaceRoot}/${conf.app.path}`
const path_app_deployed = `${workspaceRoot}/${conf.out.deploy}/${conf.app.path}`

// @TODO: how to use --virtual-store-dir during pnpm deploy ? So it can be set as the same for the different deploys

const publishedMap = new Map()

// *** Start build & deploy steps

// 1/ publish the `other mono-repos` dependencies
if (!conf.skip.publishDep) {
  for (const service of conf.app.services) {
    console.log(chalk.bgBlue('Start publish:'), service.name)
    const path_service = `${workspaceRoot}/services/${service.name}`

    // Get the dependency description and check for links protocols 
    const depList = await getDepList(path_service)

    // @TODO: warn: this function mutate 2 things: publishedMap & publishTree 
    const tree = await checkDepList(depList, publishedMap, workspaceRoot)

    const publishResult = await publishTree(tree, publishedMap)
  }

  const rewritesPath = '.deploy/rewrites.map.json'
  console.log(publishedMap.size, `dependencies will be rewrite during service install (see ${rewritesPath})`)

  saveMap(publishedMap, rewritesPath)
} else { console.log('!!!!!! Publish step skiped') }

// do a global 'install' to get all clean 
console.log(`==> Global: install`)
await execa('pnpm', ['install'], { cwd: workspaceRoot, stdio: 'inherit' })

// 2/ deploy the multi-service app structure 
if (!conf.skip.installApp) {

  console.log(`==> ${conf.app.name}: deploy`)
  // @TODO: investigate the "shadow folder" creation :
  // this command create a services/_ops/_temp/.../node_modules folder. 
  // This is created by pnpm and the reason is unknown
  const deploy = await execa('pnpm',
    ['--pnpmfile', '_ops/.pnpmfile.cjs',
      '--filter', conf.app.path,
      '--prod',
      'deploy', path_app_deployed],
    { cwd: workspaceRoot, stdio: 'inherit' })

} else { console.log('!!!!!! installApp step skiped') }


// 3/ deploy services & install config files 
if (!conf.skip.deployService) {
  console.log('Start publish services')
  for (const service of conf.app.services) {
    console.log('\n', '==> deploy service:', service.name)
    // do deploy 
    const path_service_target = `${path_app_deployed}/services/${service.name}`
    let fn = service.deployType
    let args = undefined
    if(typeof service.deployType === 'object'){
      fn = service.deployType.fn
      args = service.deployType.args  
    }
    await fn(service, path_service_target, workspaceRoot, args)

    // decrypt & copy config files 
    if (!service.conf) {
      console.log('!! There is no configuration for this service')
    } else {
      console.warn('@TODO: make the config file management "configurable"; here is a static function')
      const getConfCrypt = () => `${conf.env.path}/${envName}.config.yaml`
      const getDecryptConf = () => `${path_service_target}/_confs/config.yaml`
      await execa('sops', [`--decrypt`, `${getConfCrypt()}`], { cwd: `${projectRoot}/` }).pipeStdout(`${getDecryptConf()}`)
    }
  }
} else { console.log('!!!!!! deployService step skiped') }


// start the local instance for integration tests 
if (!conf.skip.e2eLocal) {
  await stoppable(execa('pnpm', ['prod:serve'], { cwd: path_app_deployed, stdio: 'inherit' }), 'Start Local Nodejs (no Docker)')
}

// static var for one path variable. @todo: make it an array to optimize with `copy-on-change-only`
const path_service_static = './' 

// docker image and push
// @TODO: use this const as a parameter for docker-compose, configure the path_app_deployed relatively to the context
const dockerComposeContext = `${workspaceRoot}/_ops/_temp/deploy_asset/app/`
const path_app_deployed_relativ = './'
// const path_app_deployed_relativ = path_app_deployed.replace(`${dockerComposeContext}/`, '') // @TODO: use path.relative
// console.log(path_app_deployed_relativ, '====', path_app_deployed)
const env = {
  // after `from` ENVS 
  T: envName,
  DEPLOY_PATH_LOCAL: path_app_deployed_relativ,
  DEPLOY_PATH_DOCKER: path_service_static,
  CONF_FOLDER: conf.out.envVar,
}
const cwd = 'container/'
const dockerOps = { env, cwd }

if (!conf.skip.dockerBuild) {
  // check if docker started
  try {
    await execa('docker', ['stats', '--no-stream'])
  } catch (e) {
    console.log(chalk.bgRed('Docker is not running. Start it on your machine then validate inquiry'))
    await iValidate('Docker is now started on the machine')
  }
  log('Start building the container')
  await c(dockerOps)`docker compose build jobsong-dev`
} else { console.log('!!!!!! dockerBuild step skiped') }


// @TODO: create 2 tests: direct and from docker
if (!conf.skip.e2eDocker) {
  console.log('@TODO: find a way to get the script continue when ctrl+c')

  const displayEnv = () => 'cd _ops/container \n' + Object.entries(env).map(([k, v]) => `${k}=${v}`).join(' ')
  console.log('Run this command to go inside the container :')
  console.log(`${displayEnv()} docker compose exec jobsong-dev bash`) // use sh for alpine

  await stoppable(c(dockerOps)`docker compose up --exit-code-from jobsong-dev`, true)

} else { console.log('!!!!!! e2eDocker step skiped') }


// Clean temp
await c `rm -rf ${dockerComposeContext}`

if (!conf.skip.publishApp) {
  log('Tag and push the image to google')
  // @TODO: check if a run-service with this name already exist or not. 
  //  if not, automate the steps of service's configuration and access (https://cloud.google.com/run/docs/securing/managing-access#gcloud)
  
  const registryTag = `${conf.image.registryPath}/${conf.image.path}:${branchName}`
  await c`docker tag jobsong-dev ${registryTag}`
  await c`docker push ${registryTag}`

  log('Start deploy the image')
  // const serviceName = `jobsong-dev-${target}`
  const serviceName = `${conf.app.name}-${branchName}`
  await c`gcloud run deploy ${serviceName} --image=${registryTag} --region=europe-west1`

} else { console.log('!!!!!! publishApp step skiped') }


function log(text, ...others) {
  console.log('\n', chalk.bgBlue(text), ...others)
}


