import { defineConfig } from 'vite'
import { node } from '@liuli-util/vite-plugin-node'

export default defineConfig({
  plugins: [node({ shims: true, dts: true})],
  // added to solve duplicated graphql alias in the `app` execution
  // see: https://github.com/vitest-dev/vitest/issues/4605#issuecomment-1847658160
  resolve: { alias: { graphql: "graphql/index.js" } },
})