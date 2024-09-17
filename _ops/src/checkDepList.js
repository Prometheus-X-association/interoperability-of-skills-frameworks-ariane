import { getOrCreatePublishNode } from './publish-utils.js'
import iValidate from './iValidate.js'
import { depGitCheck, getDepList } from './dep-utils.js'
import chalk from 'chalk'
import { getLastVersioningCommit } from './git-utils.js'
import {readPackage} from 'read-pkg';

export default async function checkDepList(parentDep, publishedMap, workspaceRoot, cascadeLevel = 0, parentNode = null) {
  if (!parentDep.dependencies) return {}

  const header = Array(cascadeLevel).fill('    ')
  const _parentNode = parentNode ?? getOrCreatePublishNode(parentDep.name, parentDep.path)

  // A) check the currentDep (aka parentDep)
  await updatePublishStatus(parentDep, _parentNode, { publishedMap, header })

  // B) check dependencies of this package,
  // -- do the preliminary calculations to identify the deps to analyse
  const toAnalyse = {}
  for (const [depId, dep] of Object.entries(parentDep.dependencies)) {
    if (dep.protocol.startsWith('path:')) {
      console.log(chalk.bgRed(`${header}In the package:`, parentDep.name, 'this dependency as a `path:` protocol:', depId))
      console.log(`${header}This case is not implemented, please change to \`link:\` or \`workspace\` protocols`)
      throw new Error(`Change path protocol for ${depId} in ${parentDep.name}`)
    }

    // console.group()
    if (dep.version.startsWith('link:')) {
      // 1/ process links to a "node_modules" for `should be unique` deps
      // This kind of deps appear because of `only one instance dependencies` (like graphql & react)
      // Check if this is a link to a node module folder and skip if yes ? 
      if (dep.version.includes('/node_modules/')) {
        let found = publishedMap.get(depId)
        if (found) continue
        // get the package detail and reuse current version
        const pkg = await readPackage({cwd: dep.path})
        publishedMap.set(depId, {
          version: pkg.version,
          type: 'unique_3rdParty_dep'
        })
        // console.groupEnd()
        continue
      }

      // 2/ manage "in repository" deps 
      if (dep.path.startsWith(workspaceRoot)) {
        // this one should be workspaced
        if (!dep.protocol.startsWith('workspace:')) {
          console.log(chalk.bgRed(`${header}In ${parentDep.name}, the dependency ${depId} should be called with 'workspace:*':`))
          throw new Error('See previous logs')
        }
        // this case is skipped, managed by pnpm
        continue
      }

      toAnalyse[depId] = dep
    }
  }

  // 3/ check for publishable status for sub-dependencies (from the same repos or another one)
  // -- check the packages of the dependencies
  // It answer the question: This module should be published or do we use the current version ?
  // It check for the last "publishing-commit" and ask the user's choice. 
  for (const [depId, dep] of Object.entries(toAnalyse)) {
    const isDebug = false // depId === '@mmorg/rdfx-refine'
    console.log(`${header}==> Analyse linked dependency:`, depId)

    await depGitCheck(dep.path)

    // create the package details
    const dep_target = await getDepList(dep.path)

    const depNode = getOrCreatePublishNode(dep_target.name, dep.path)

    if (!depNode.lastPublishingCommit) {
      await updatePublishStatus(dep_target, depNode, { publishedMap, header, isDebug })
    }

    if (isDebug) console.log(depNode)

    //   push the node into the _parentNode
    await checkDepList(dep_target, publishedMap, workspaceRoot, cascadeLevel + 1, depNode)
    _parentNode.children.push(depNode)
  }

  console.groupEnd()
  return _parentNode

}

async function updatePublishStatus(dep, depNode, { publishedMap, header, isDebug }) {
  // skip deps already marked as "toPublish"
  if (depNode.toPublish) return
  
  // exclude package with @secretpkg, as it can be `service with library` (like storybook)
  const isService = dep.path.includes('/services/') && !dep.name.startsWith('@secretpkg')
  const commitSinceRelease = await getLastVersioningCommit(dep.path, isDebug)

  if (isDebug) {
    console.log('commitSinceRelease', commitSinceRelease)
  }

  let continueWithoutRelease = true
  if (commitSinceRelease) {
    depNode.lastPublishingCommit = commitSinceRelease.commit
    console.log('\n', `${header}${dep.name} : commits since last release:`)
    console.log(chalk.bgBlack(commitSinceRelease.message))
    if (isService) {
      console.log(chalk.bgYellow('This is a **service** package. Theses packages are not published'))
    } else {
      continueWithoutRelease = !(await iValidate(`Do you want to publish theses changes ?`))
    }

  }

  depNode.toPublish = !continueWithoutRelease
  if (continueWithoutRelease) {
    // console.log(`${header}The published version this package will be used: ${dep.name}@${dep.version}`)
    publishedMap.set(dep.name, {
      version: dep.version,
      type: 'linked_monorepo_published_dep'
    })
  }
}