import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  build: {
    outDir: './build',
    rollupOptions: {
      plugins: [nodeResolve()],
      external: (id, parentId, isResolved) => {
        // if(id.endsWith('@mmorg/rdfx-refine')){
        //   console.log('Special case for @mmorg/rdfx-refine', 'Rollup config for "external"')
        //   return true
        // }
      },
    }
  }
});