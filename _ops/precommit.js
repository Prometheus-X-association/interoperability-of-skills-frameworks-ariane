import { execa } from 'execa'
import chalk from 'chalk'
import { listStagedFiles, logCommits, parseCommits } from './src/git-utils.js'

//Define threshold
const maxCommitWithoutChangeset = 10
const bigCommitThreshold = 20

//changeset info
const commitedChangesets = await logCommits('.changeset')
const stagedChangeset = await listStagedFiles('.changeset')
const lastChangesetCommit = parseCommits(commitedChangesets)[0]

//Commits et staged files infos
const getAllCommits = await logCommits('./')
const allCommits = parseCommits(getAllCommits)
const allStagedFiles = await listStagedFiles('./')
const numberOfStagedFiles = allStagedFiles.split('\n').length
const isBigCommit = numberOfStagedFiles > bigCommitThreshold 


// Finding in commit list index of our last changeset related commit 
const getCommitsSinceLastChangeset = (changesetCommit, commitList) => {
  const hashOfInterest = changesetCommit.hash.replace('commit ', '')
  const changesetIndex = commitList.findIndex(
    (commit) => commit.hash.replace('commit ', '') === hashOfInterest
  )
  return changesetIndex
}

const counterSinceLastChangeset = getCommitsSinceLastChangeset(
  lastChangesetCommit,
  allCommits
)


// process exit conditions

if (
  counterSinceLastChangeset >= maxCommitWithoutChangeset &&
  !stagedChangeset &&
  !isBigCommit || (isBigCommit && !stagedChangeset)
) {
  console.log(
    chalk.bgRed(`${counterSinceLastChangeset} commits since last changeset.
    Please run -- $ npx changeset --`)
  )
  process.exit(1)
}

if (isBigCommit && !stagedChangeset) {
  console.log(
    chalk.bgRed(
      `It looks a big commit. Please run -- $ npx changeset --`
    )
  )
  process.exit(1)
}
