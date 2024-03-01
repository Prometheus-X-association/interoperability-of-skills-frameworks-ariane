import path from 'path'
import { execa } from 'execa'
import getGCloudUtil from './getGCloudUtil.js'

const liveConf = { stdio: 'inherit' }

/**
 * Copy folder "as is" to a GCP compute target
 * @param {object} service 
 * @param {object} app 
 * @param {string} workspaceRoot
 * @returns 
 */
export async function nbookable(service, app, workspaceRoot) {
  const gUtil = getGCloudUtil(service, app, workspaceRoot)
  // copy & create the target directory if not exist
  await gUtil.scp()
}