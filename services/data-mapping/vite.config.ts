import { defineConfig } from 'vite'
import { node } from '@liuli-util/vite-plugin-node'

export default defineConfig({
  plugins: [node({ shims: true, dts: true})],
})