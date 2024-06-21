import { createHash } from 'node:crypto';

const toHash = 'Motivation et implication'
console.log(md5(toHash))

function md5(content) {
  return createHash('md5').update(content).digest('hex')
}