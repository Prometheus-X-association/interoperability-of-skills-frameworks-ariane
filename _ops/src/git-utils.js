import path from 'node:path'
import { execa } from 'execa'
import escapeStringRegexp from 'escape-string-regexp'
import chalk from 'chalk'
import { mapAdd, mapAddStates } from './map-utils.js'

// source: https://github.com/sindresorhus/np/blob/main/source/git-util.js
// *** first is added / changed functions

// return a value if there is commits since the last versioning commit
// @TODO: optimize to not analyse multiple time the same package.
export const getLastVersioningCommit = async (dep_path, isDebug) => {
  const packageLogs = await execa(
    'git',
    ['log', '--pretty=format:%h', 'package.json'],
    { cwd: dep_path }
  )
  const packageCommits = packageLogs.stdout.split('\n')

  // find last release commit ; ie, the one that change `"version" :"` field
  let packageReleaseCommit = undefined
  let commitDiff = undefined
  for (const commit of packageCommits) {
    // --unified=0 is for only get the changed lines, not the context: https://stackoverflow.com/questions/18810623/git-diff-to-show-only-lines-that-have-been-modified
    commitDiff = await execa(
      'git',
      ['show', '--unified=0', commit, 'package.json'],
      { cwd: dep_path }
    )
    // @TODO: ?? use the -S parameter to let git do the search ? see `By Content` in https://www.atlassian.com/git/tutorials/git-log
    if (commitDiff.stdout.includes('"version": "')) {
      packageReleaseCommit = commit
      break
    }
  }

  let changeMessage = undefined
  if (!packageReleaseCommit) {
    changeMessage = 'This package was never published.'
    console.log(chalk.bgRed(changeMessage))
  } else {
    changeMessage = await execa(
      'git',
      ['shortlog', `${packageReleaseCommit}..HEAD`, '.'],
      { cwd: dep_path }
    )
  }

  if (isDebug) {
    console.log('commitDiff identified:', commitDiff)
    console.log('changeMessage:', changeMessage)
  }

  if (!changeMessage?.stdout?.length) return undefined

  return {
    commit: packageReleaseCommit,
    message: changeMessage.stdout,
  }
}

export const statusStates = {
  added: 'A',
  modified: 'M',
  untracked: '??',
  typechange: 'T',
  staged: 'S',
}

/**
 * Parse the git status output. Status objects in the 2 indexes are the sames. (values in both indexes refer to the same object)
 * `testMock` is a workaround property until ES6 mocking of a script's dependency work.
 * @param {string} path
 * @param {*} testMock
 * @return Object
 * @todo define the return type
 */
export const statusParse = async (path = '', { testValue } = {}) => {
  let status
  if (!testValue) {
    ;({ stdout: status } = await execa('git', [
      'status',
      path,
      '--porcelain',
      '--branch',
    ]))
  } else {
    status = testValue
  }

  const [branch, ...lines] = status.split('\n')
  const fileIndex = new Map()
  const statusIndex = new Map()
  for (const l of lines) {
    const status = l.slice(0, 2)
    const path = l.slice(3)
    const status_payload = { id: path, status: [] }

    // untracked
    if (status === statusStates.untracked) status_payload.status.push(status)
    // staged = added + modified (1srt place) + typechange
    if (status.startsWith(statusStates.added))
      status_payload.status.push(statusStates.added, statusStates.staged)
    if (status.startsWith(statusStates.modified))
      status_payload.status.push(statusStates.modified, statusStates.staged)
    if (status.startsWith(statusStates.typechange))
      status_payload.status.push(statusStates.typechange, statusStates.staged)
    // modified
    if (status.endsWith(statusStates.modified))
      status_payload.status.push(statusStates.modified)

    mapAdd(fileIndex, path, status_payload, mapAddStates.unique)
    for (const st of status_payload.status) {
      mapAdd(statusIndex, st, status_payload)
    }
  }

  return {
    branch,
    byFile: fileIndex,
    byStatus: statusIndex,
  }
}

export const stage = async (path, options = undefined) =>
  await execa('git', ['add', path], options)
export const unstage = async (path, options = undefined) =>
  await execa('git', ['restore', '--staged', path], options)

// *** start original file
export const latestTag = async () => {
  const { stdout } = await execa('git', ['describe', '--abbrev=0', '--tags'])
  return stdout
}

export const root = async (options = undefined) => {
  const { stdout } = await execa(
    'git',
    ['rev-parse', '--show-toplevel'],
    options
  )
  return stdout
}

export const readFileFromLastRelease = async (file) => {
  const filePathFromRoot = path.relative(await root(), file)
  const { stdout: oldFile } = await execa('git', [
    'show',
    `${await latestTag()}:${filePathFromRoot}`,
  ])
  return oldFile
}

const firstCommit = async () => {
  const { stdout } = await execa('git', ['rev-list', '--max-parents=0', 'HEAD'])
  return stdout
}

export const previousTagOrFirstCommit = async () => {
  const tags = await tagList()

  if (tags.length === 0) {
    return
  }

  if (tags.length === 1) {
    return firstCommit()
  }

  try {
    // Return the tag before the latest one.
    const latest = await latestTag()
    const index = tags.indexOf(latest)
    return tags[index - 1]
  } catch {
    // Fallback to the first commit.
    return firstCommit()
  }
}

export const latestTagOrFirstCommit = async () => {
  let latest
  try {
    // In case a previous tag exists, we use it to compare the current repo status to.
    latest = await latestTag()
  } catch {
    // Otherwise, we fallback to using the first commit for comparison.
    latest = await firstCommit()
  }

  return latest
}

export const hasUpstream = async () => {
  const escapedCurrentBranch = escapeStringRegexp(await getCurrentBranch())
  const { stdout } = await execa('git', [
    'status',
    '--short',
    '--branch',
    '--porcelain',
  ])

  return new RegExp(
    String.raw`^## ${escapedCurrentBranch}\.\.\..+\/${escapedCurrentBranch}`
  ).test(stdout)
}

export const getCurrentBranch = async () => {
  const { stdout } = await execa('git', ['symbolic-ref', '--short', 'HEAD'])
  return stdout
}

export const verifyCurrentBranchIsReleaseBranch = async (releaseBranch) => {
  const currentBranch = await getCurrentBranch()
  if (currentBranch !== releaseBranch) {
    throw new Error(
      `Not on \`${releaseBranch}\` branch. Use --any-branch to publish anyway, or set a different release branch using --branch.`
    )
  }
}

export const tagList = async () => {
  // Returns the list of tags, sorted by creation date in ascending order.
  const { stdout } = await execa('git', ['tag', '--sort=creatordate'])
  return stdout.split('\n')
}

export const isHeadDetached = async () => {
  try {
    // Command will fail with code 1 if the HEAD is detached.
    await execa('git', ['symbolic-ref', '--quiet', 'HEAD'])
    return false
  } catch {
    return true
  }
}

export const isWorkingTreeClean = async () => {
  try {
    const { stdout: status } = await execa('git', ['status', '--porcelain'])
    if (status !== '') {
      return false
    }

    return true
  } catch {
    return false
  }
}

export const verifyWorkingTreeIsClean = async () => {
  if (!(await isWorkingTreeClean())) {
    throw new Error('Unclean working tree. Commit or stash changes first.')
  }
}

const hasRemote = async () => {
  try {
    await execa('git', ['rev-parse', '@{u}'])
  } catch {
    // Has no remote if command fails
    return false
  }

  return true
}

const hasUnfetchedChangesFromRemote = async () => {
  const { stdout: possibleNewChanges } = await execa('git', [
    'fetch',
    '--dry-run',
  ])

  // There are no unfetched changes if output is empty.
  return !possibleNewChanges || possibleNewChanges === ''
}

const isRemoteHistoryClean = async () => {
  const { stdout: history } = await execa('git', [
    'rev-list',
    '--count',
    '--left-only',
    '@{u}...HEAD',
  ])

  // Remote history is clean if there are 0 revisions.
  return history === '0'
}

export const verifyRemoteHistoryIsClean = async () => {
  if (!(await hasRemote())) {
    return
  }

  if (!(await hasUnfetchedChangesFromRemote())) {
    throw new Error(
      'Remote history differs. Please run `git fetch` and pull changes.'
    )
  }

  if (!(await isRemoteHistoryClean())) {
    throw new Error('Remote history differs. Please pull changes.')
  }
}

export const verifyRemoteIsValid = async () => {
  try {
    await execa('git', ['ls-remote', 'origin', 'HEAD'])
  } catch (error) {
    throw new Error(error.stderr.replace('fatal:', 'Git fatal error:'))
  }
}

export const fetch = async () => {
  await execa('git', ['fetch'])
}

export const tagExistsOnRemote = async (tagName) => {
  try {
    const { stdout: revInfo } = await execa('git', [
      'rev-parse',
      '--quiet',
      '--verify',
      `refs/tags/${tagName}`,
    ])

    if (revInfo) {
      return true
    }

    return false
  } catch (error) {
    // Command fails with code 1 and no output if the tag does not exist, even though `--quiet` is provided
    // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
    if (error.stdout === '' && error.stderr === '') {
      return false
    }

    throw error
  }
}

async function hasLocalBranch(branch) {
  try {
    await execa('git', [
      'show-ref',
      '--verify',
      '--quiet',
      `refs/heads/${branch}`,
    ])
    return true
  } catch {
    return false
  }
}

export const defaultBranch = async () => {
  for (const branch of ['main', 'master', 'gh-pages']) {
    // eslint-disable-next-line no-await-in-loop
    if (await hasLocalBranch(branch)) {
      return branch
    }
  }

  throw new Error(
    'Could not infer the default Git branch. Please specify one with the --branch flag or with a np config.'
  )
}

export const verifyTagDoesNotExistOnRemote = async (tagName) => {
  if (await tagExistsOnRemote(tagName)) {
    throw new Error(`Git tag \`${tagName}\` already exists.`)
  }
}

export const commitLogFromRevision = async (revision) => {
  const { stdout } = await execa('git', [
    'log',
    '--format=%s %h',
    `${revision}..HEAD`,
  ])
  return stdout
}

export const pushGraceful = async (remoteIsOnGitHub) => {
  try {
    await push()
  } catch (error) {
    if (remoteIsOnGitHub && error.stderr && error.stderr.includes('GH006')) {
      // Try to push tags only, when commits can't be pushed due to branch protection
      await execa('git', ['push', '--tags'])
      return {
        pushed: 'tags',
        reason:
          'Branch protection: np can`t push the commits. Push them manually.',
      }
    }

    throw error
  }
}

export const push = async () => {
  await execa('git', ['push', '--follow-tags'])
}

export const deleteTag = async (tagName) => {
  await execa('git', ['tag', '--delete', tagName])
}

export const removeLastCommit = async () => {
  await execa('git', ['reset', '--hard', 'HEAD~1'])
}

// not used and external file dep
// const gitVersion = async () => {
// 	const {stdout} = await execa('git', ['version']);
// 	const match = /git version (?<version>\d+\.\d+\.\d+).*/.exec(stdout);
// 	return match && match.groups.version;
// };

// export const verifyRecentGitVersion = async () => {
// 	const installedVersion = await gitVersion();

// 	Version.verifyRequirementSatisfied('git', installedVersion);
// };

export const checkIfFileGitIgnored = async (pathToFile) => {
  try {
    const { stdout } = await execa('git', ['check-ignore', pathToFile])
    return Boolean(stdout)
  } catch (error) {
    // If file is not ignored, `git check-ignore` throws an empty error and exits.
    // Check that and return false so as not to throw an unwanted error.
    if (error.stdout === '' && error.stderr === '') {
      return false
    }

    throw error
  }
}

export const listStagedFiles = async (path) => {
  try {
    const { stdout } = await execa('git', [
      'diff',
      '--staged',
      '--name-only',
      '--cached',
      `${path}`,
    ])
    return stdout
  } catch (error) {
    console.log(' git error :' + error)
  }
}

export const logCommits = async (path) => {
  try {
    const { stdout } = await execa('git', ['log', '--', `${path}`])
    return stdout
  } catch (error) {
    console.log(' git error :' + error)
  }
}

export function parseCommits(commitsToParse) {
  return commitsToParse
    .split(/\scommit\s(?=\S)/)
    .filter(Boolean)
    .map((commit) => {
      let date, author
      let isAMerge = false
      const lines = commit.split('\n').filter(Boolean)
      const hash = lines[0].trim()

      if (lines[1].startsWith('Merge')) {
        author = lines[2].replace('Author:', '').trim()
        date = lines[3].replace('Date:', '').trim()
        isAMerge = true
      } else {
        author = lines[1].replace('Author:', '').trim()
        date = lines[2].replace('Date:', '').trim()
      }

      const message = lines.slice(3).join('\n')

      return { hash, author, date, message, isAMerge }
    })
}
