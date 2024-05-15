import { log } from 'console'
import { setTimeout } from 'timers/promises'

// *** Start : manage stopable processes
// It attach to the main process and manage the sub-process killing on ctrl+c
let current_process = null
process.on('SIGINT', async () => {
  console.log('==================== ctrl+c called !')
  if (current_process) {
    current_process.kill()
    console.log('Current process killed, press ctrl+c twice to stop the deploy process')
  } else {
    process.exit()
  }
})

/**
 * 
 * @param {import('execa').ExecaChildProcess} execaFn 
 */
export async function stoppable(execaFn, message) {
  message = message ?? 'Start Fn sub-process'
  const ctrlc = 'Hit ctrl+c when you are done'
  console.log('\n', `Stoppable: ${message} - ${ctrlc}`)
  current_process = execaFn
  try {
    await execaFn
  } catch (e) {
    console.log(e)
    if (execaFn.spawnfile === 'docker' && (e.exitCode === 130 || e.exitCode === 1) )  {
      await setTimeout(2000)
      console.log('Docker logs should be ended now, continue the deploy')
      return 
    }
    if (e.signal === 'SIGINT' || e.signal === 'SIGTERM') return
    throw e
  }
}
// *** End : manage stopable processes