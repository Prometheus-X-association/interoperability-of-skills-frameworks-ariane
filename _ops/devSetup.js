import fs from 'fs'
import { execa } from 'execa'
import chalk from 'chalk'
import { root } from './src/git-utils.js'
import { readData, saveData } from '@mmorg/fsutils'
import hash from 'object-hash'

// configuration 
// @TODO: make smarter crypt file detection and associated project configuration
const workspaceRoot = await root()
const cwd = `${workspaceRoot}/`

const conf = {
  app: {
    path: 'services/profile-api',
    name: 'rome4-api',
  },
  env: {
    path: '_ops/_env'
  },
}
const target = 'local'

const cryptPath = `${conf.env.path}/${target}.config.yaml`
const decryptPath = `${workspaceRoot}/${conf.app.path}/_confs/config.yaml`

log('env check: compare the local and the crypted files', cryptPath, '==', decryptPath)

const { stdout: crypt } = await execa('sops', [`--decrypt`, `${cryptPath}`], { cwd })

// 1/ is local file exist ? 
if (fs.existsSync(decryptPath)) {
  // a/ Are content the sames ? 
  const decrypt_source = readData(decryptPath)
  if (hash({ content: decrypt_source }) === hash({ content: crypt })) {
    log('env check: content are the same, no change applied')
    process.exit(0)
  } else {
    log('env check: content of the crypted file and your local differ.')
    // @TODO: for now, can't ask the user before update the file (with `iValidate`) because the stdin / stdout are keep by pnpm )
    const decryptBackPath = `${decryptPath}.back`
    log(`env check: your local configuration backed at : ${decryptBackPath}`)
    saveData(decrypt_source, decryptBackPath)
  }
}
// all exit conditions checked, let's decrypt the file : 
log(`env chec: decrypt the *${target}* env file to \n ${decryptPath}`)
saveData(crypt, decryptPath)
// await execa('sops', [`--decrypt`, `${cryptPath}`], { cwd }).pipeStdout(`${decryptPath}`)

function log(text, ...others) {
  console.log('\n', chalk.bgBlue(text), ...others)
}