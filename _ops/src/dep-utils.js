import { execa } from 'execa'
import iValidate from './iValidate.js'
import chalk from 'chalk'
import { readJson } from '@mmorg/fsutils'
import {readPackage} from 'read-pkg';

export async function getDepList(depPath) {
  try {
    const source = await readPackage({cwd: depPath})
    const {stdout} = await execa('pnpm', ['list', '-json'], { cwd: depPath })
    const resolved = JSON.parse(stdout)[0]
    // mix the resolved dependencies with the source call 
    for(const [depId, depResolve] of Object.entries(resolved.dependencies ?? {})){
      const protocol = source.dependencies[depId]
      depResolve.protocol = protocol
    }    
    return resolved

  } catch (e) {
    console.error(e)
    console.log('For depPath parameter:', depPath)
    throw new Error(e)
  }

}

const remoteUpdateCache = new Map()
export async function depGitCheck(depPath) {
  // a) update local git with remote infos
  if (remoteUpdateCache.has(depPath)) return remoteUpdateCache.get(depPath)

  const updateRemote = await execa('git', ['remote', 'update'], { cwd: depPath })
  // set cache to false by default for error management. Make it true at the end
  remoteUpdateCache.set(depPath, false)

  // b) check if the current branch as an upstream 
  let hasUpstream = true
  try {
    await execa('git', ['name-rev', '@{u}'], { cwd: depPath })
  } catch (e) {
    if (e.stderr.startsWith('fatal: no upstream configured for branch')) hasUpstream = false
    else throw e
  }

  // c) check for un-pulled commit from the branch
  if (!hasUpstream) {
    console.warn(`Your local git branch has no upstream. So check for un-pulled commit is skipped.`)
  } else {
    // check for un-pulled commits
    const gitRevList = await execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD', '.'], { cwd: depPath })
    if (gitRevList.stdout === '0') { //@TODO: create and index for checked upstreams
      console.log('Local is updated with remote branch.')
    } else {
      console.log('Local branch is behind in this repository:', depPath)
      if(await iValidate('Do you want to update your local ?')){
        const gitRevList = await execa('git', ['pull'], { cwd: depPath })
        console.log(
          chalk.red('@TODO: check for pull error \n ==== \n'), 
          gitRevList.stdout,
          chalk.red('\n ==== \n')
          )
      }else{
        console.log(chalk.bgYellow('Published deps will not be updated with remote'))
        remoteUpdateCache.set(depPath, false)
      }
    }
    // @TODO: add a check for `--right-only` to get the unpushed commits
  }

  remoteUpdateCache.set(depPath, true)
}