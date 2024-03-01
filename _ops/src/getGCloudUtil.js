import path from 'path'
import { execa } from 'execa'
import YAML from 'yaml'
import chalk from 'chalk'
import { on } from 'events'
const liveConf = { stdio: 'inherit' }

const info = (str) => console.log(chalk.bgBlue(str))

export default function getGCloudUtil(service, app, workspaceRoot) {
  const { gcp } = app
  const path_service = `${workspaceRoot}/${service.path}/`

  const path_remote_path = `/home/${gcp.user}/${service.path}`
  const path_remote_parent = path.basename(path.dirname(path_remote_path))
  const path_remote_at = `${gcp.user}@${gcp.instance}`
  const path_service_target = `${path_remote_at}:${path_remote_parent}`

  return {
    gCompute,
    scp,
    ssh,
    isRunning,
    start,
    stop,
  }

  async function gCompute(sParam, liveConf = undefined) {
    const project = ['--project', gcp.project]
    const zone = ['--zone', gcp.zone]
    return await execa('gcloud', ['compute', ...sParam, ...project, ...zone], liveConf)
  }

  async function gWorkbench(sParam, liveConf = undefined) {
    const project = ['--project', gcp.project]
    const location = ['--location', gcp.zone]
    return await execa('gcloud', ['workbench', ...sParam, ...project, ...location], liveConf)
  }

  async function scp() {
    const mkdir = ['mkdir', '-p', path_remote_parent]
    await ssh(mkdir)
    console.log('Start copy the files to the remote')
    await gCompute(['scp', '--recurse', path_service, path_service_target], liveConf)
  }
  async function ssh(cmd, live) { await gCompute(['ssh', path_remote_at, '--command', `${cmd.join(' ')}`], live ? liveConf : undefined) }

  async function isRunning() {
    const { stdout } = await gCompute(['instances', 'describe', gcp.instance])

    const r = YAML.parse(stdout)
    const started = r.status === 'RUNNING'
    if (!started) {
      console.log('Engine is not started but with state:', r.status)
      return false
    }
    return true
  }

  async function start(live) {
    if (live) info(`Start instance ${gcp.instance}:`)
    await gWorkbench(['instances', 'start', gcp.instance], live ? liveConf : undefined)
    if (live) console.log()
  }

  async function stop(live) {
    if (live) info(`Stop instance ${gcp.instance}:`)
    await gWorkbench(['instances', 'stop', gcp.instance], live ? liveConf : undefined)
    if (live) console.log()
  }
}