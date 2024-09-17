import { relative } from "path";
// @TODO: import this deps from a published _ops package
import { root } from '../_ops/src/git-utils.js'
import config from '../_ops/config.js'
import { execa } from 'execa'

const conf = config

const workspaceRoot = await root()
const path_app_deployed = `${workspaceRoot}/${conf.out.deploy}/${conf.app.name}`
const from = `${workspaceRoot}/${conf.app.name}/services`

// 0/ remove all the services/ content
// @TODO: something more smart that ask for validation and/or check the existing links
await execa('rm', ['-rf', `${from}/*`])

// 1/ list the services and create relative links
for (const service of config.app.services) {
  const to = `${path_app_deployed}/services/${service.name}`
  const rel = relative(from, to)
  const ln = await execa('ln', ['-s', rel], { cwd: from })
}