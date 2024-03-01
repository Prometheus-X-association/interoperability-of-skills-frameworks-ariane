import chalk from 'chalk'
import { execa } from 'execa'

export async function deployable(service, path_service_target, workspaceRoot) {
  const deploy = async () => await execa('pnpm',
    ['--pnpmfile', '_ops/.pnpmfile.cjs', '--filter', service.name, '--prod', 'deploy', path_service_target],
    { cwd: workspaceRoot, stdio: 'inherit' })
  try {
    await deploy()
  } catch (e) {
    console.log('================ Log the Error & retry to audit the windows bug =====================')
    console.log(e)
    deploy()
  }
}

const show_command = true
export async function buildable(service, path_service_target, workspaceRoot) {
  const path_service = `${workspaceRoot}/services/${service.name}`
  const pkg_name = service.name_pkg ? service.name_pkg : service.name
  const build = await execa('pnpm',
    ['--filter', pkg_name, 'build'],
    { cwd: workspaceRoot, stdio: 'inherit' })
  
  if(show_command){
    console.log(chalk.underline(build.escapedCommand))
  }
  // @TODO: do a check on the stdout even if we stdio: 'inherit'
  // if(build.stdout.startsWith('No projects matched the filters')){
  //   console.log('=====\n', build)
  //   throw new Error('Pnpm build failed. See previous execa out.')
  // }
  const rm_old = await execa('rm', ['-rf', path_service_target])
  const mv_new = await execa('mv', [`${path_service}/build`, path_service_target])
  // console.log(copy)
  console.log('Build destination:', path_service_target)
}

/**
 * Copy all a folder "as is". Used for python deploy on local
 * @param {string} service 
 * @param {string} path_service_target 
 * @param {string} workspaceRoot 
 * @todo make a more specific copy to only get used files (via config.app.service.conf ?)
 */
export async function copyable(service, path_service_target, workspaceRoot, {toRemove} = {}){
  const rm_old = await execa('rm', ['-rf', path_service_target])
  const path_service = service.path ? `${workspaceRoot}/${service.path}` : `${workspaceRoot}/services/${service.name}`
  if(!service.path) console.warn('Please use the .path property of service')
  await execa('cp', ['-r', path_service, path_service_target])

  if(toRemove){
    console.log('This is a partial copy, there is files to remove')
    await execa('rm', ['-rf', `${path_service_target}/${toRemove}`])
  }
}


