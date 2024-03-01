import packageJson, { PackageNotFoundError } from 'package-json'
import { root, stage, statusParse, statusStates } from './git-utils.js'
import { execa } from 'execa'
import chalk from 'chalk'
import iValidate from './iValidate.js'
import { readPackage } from 'read-pkg'
import { default as nodePath } from 'path'

/**
 * @typedef PublishNode
 * @property {string} id 
 * @property {string} path 
 * @property {string} lastPublishingCommit
 * @property {[PublishNode]} children
 * @property {boolean} toPublish
 * @property {boolean} published
 */

/**
 * @typedef PublishTree 
 * @property {object|Map} index
 * @property {[PublishNode]} tree
 */

export async function changeset(publishNode) {
  if (publishNode.hasChangeset) return // already processed node 

  // @TODO: make them embeded parameters in publishNode
  const path = publishNode.path
  const monorepoRoot = await root({ cwd: path })
  // const relativePath = path.replace(`${monorepoRoot}/`, './')
  const ops = { cwd: monorepoRoot, stdio: 'inherit' }

  await getSyntheticChanges(publishNode.lastPublishingCommit, publishNode.path, ops)

  console.log(chalk.bgRed(`!!!!!! The package to publish is ${publishNode.id} !!!!!`))
  await execa('pwd', ops)
  await execa('pnpm', ['changeset'], ops)
  publishNode.hasChangeset = true
}


export async function publishTree(publishNode, publishedMap) {

  // start creating the changesets
  await changesetNode(publishNode)

  await publishAndCommit(publishNode, publishedMap)

}

/**
 * 
 * @param {PublishNode} publishNode 
 * @param {*} publishedMap 
 */
export async function changesetNode(publishNode, publishedMap) {

  // go depth first
  if (publishNode?.children?.length) {
    for (const pn of publishNode.children) {
      await changesetNode(pn, publishedMap)
    }
  }

  // now process with changeSet creation
  if (publishNode.toPublish) {
    await changeset(publishNode)
  }

}

async function publishAndCommit(publishNode, publishedMap) {
  const workspaces = new Set()
  let isChangesetedAndCommit = false
  async function recursePublish(pn) {
    if (pn?.children?.length) {
      for (const p of pn.children) {
        await recursePublish(p)
      }
    }
    if (pn.toPublish) {
      // check the root each time
      // @TODO: something more smart that check if the workspace already exist
      const wp = await root({ cwd: pn.path })

      const ops = { cwd: wp, stdio: 'inherit' }
      const ops_local = { cwd: pn.path, stdio: 'inherit' }
      if (!isChangesetedAndCommit) {
        // create the changeset version
        await execa('pnpm', ['changeset', 'version'], ops)
        await execa('pnpm', ['install'], ops)

        console.log('\n', chalk.bgYellow('Please review the changes'))
        await execa('git', ['status', '.'], ops_local)

        // ask for commit and publish validation
        const okay = await iValidate(`Do you want to commit then publish ?`)
        if (!okay) throw new Error('Please commit the changes and publish the package manually')

        // parse the local status, add modified or typechanged files to mimic -am in a local folder
        /* @TODO: debug and restore this part
        const { byStatus } = await statusParse(ops_local.cwd)
        const am = [byStatus.get(statusStates.modified) ?? [], byStatus.get(statusStates.typechange) ?? []].flat()
        const stagePaths = am.map(({id}) => id).join(' ')
        await stage(stagePaths, ops)
        await execa('git', ['commit', '-m', 'chore: publish'], ops_local)
        */
       
        isChangesetedAndCommit = true
      }

      const relPackagePath = nodePath.relative(wp, pn.path)
      try{
        await execa('pnpm', ['publish', '--no-git-check', relPackagePath], ops)
      }catch(e){
        console.log(e)
        console.log(chalk.bgRed('This is a publish bug to solve: the local version is not updated so publish failed because number already exists'))
        console.log(chalk.bgYellow('There is another possible bug about publishing the dependant dépendencies versions'))
        await iValidate('Manual publish is okay')
      }
      

      // retrieve the published version & update publishedMap
      const dep = await readPackage({ cwd: pn.path })
      publishedMap.set(dep.name, {
        version: dep.version,
        type: 'linked_monorepo_NEW_published_dep'
      })

    }
  }

  await recursePublish(publishNode)

  // await recursePublished(publishNode)
  console.log(chalk.green('Publish okay'))
}

const publishNodeCache = new Map()
/**
 * 
 * @param {string} id 
 * @param {string} path 
 * @returns {PublishNode}
 */
export function getOrCreatePublishNode(id, path) {
  if (publishNodeCache.has(path)) return publishNodeCache.get(path)
  const node = {
    id,
    path,
    lastPublishingCommit: undefined,
    children: [],
    toPublish: false,
    published: false,
  }
  publishNodeCache.set(path, node)
  return node
}

export async function getLastPublishedPackage(packageID) {
  try {
    return await packageJson(packageID, { fullMetadata: true })
  } catch (e) {
    if (!(e instanceof PackageNotFoundError)) return e
    return false
  }
}

function getLinkedDeps(pkg) {
  const dependencies = pkg?.dependencies ?? {}
  return Object.values(dependencies).filter(dep => dep.version.startsWith('link:')) ?? []
}

async function getSyntheticChanges(packageReleaseCommit, packagePath, ops) {
  console.log(chalk.bgYellow('Summary of the changes:'))
  if (!packageReleaseCommit) {
    console.log(chalk.bgRed('This package was never published.'))
    return
  }
  await execa('git', ['shortlog', `${packageReleaseCommit}..HEAD`, packagePath], ops)
  // @TODO: ask for more detail and present others options ?
  // other options for showing changes with more details:
  // await execa('git', ['log', '--stat', `${packageReleaseCommit}..HEAD`, '.'], ops)
  // `git log --p fc52cdc..HEAD .`
  // `
  // git log --color --graph --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset" ${packageReleaseCommit}..HEAD ${relativePath}
  // `
}
