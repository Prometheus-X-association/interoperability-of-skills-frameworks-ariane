import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
import {readData} from '@mmorg/fsutils'
import YAML from 'yaml'

const config = YAML.parse(readData(`${__dirname}/config.yaml`))
export default config