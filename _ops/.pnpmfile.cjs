let _rewriteMap = undefined
let _rewritePromise = undefined
// function to read map only once in pnpm parallel execution but in cjs (no top level await)
async function getMap() {
  if (_rewriteMap) return _rewriteMap
  if (_rewritePromise) return _rewritePromise
  if (!_rewritePromise) {
    _rewritePromise = new Promise(async (resolve) => {
      const { readMap } = await import('@mmorg/fsutils')
      const _rewriteMap = readMap('_ops/.deploy/rewrites.map.json')
      resolve(_rewriteMap)
    })
  }

  return _rewritePromise
}


module.exports = {
  hooks: {
    async readPackage(pkg, context) {
      const rewriteMap = await getMap()
      pkg.dependenciesMeta = pkg.dependenciesMeta || {}
      for (const [depName, depVersion] of Object.entries(pkg.dependencies)) {
        // debug for windows install 
        /*if (depName === '@secretpkg/storybook') {
          console.log('========= Debug graphql lib version =====')
          console.log('Package root', pkg)
          console.log('Dependencies infos:', depName, 'version:', depVersion)
          console.log('========= End debug=====')
        }*/

        if (depVersion.startsWith('file:')) {
          throw new Error('In package: ' + pkg.name + 'This dep with file protocol should be changed to link:' + depName)
        }
        if (depVersion.startsWith('link:')) {
          let rewrite = rewriteMap.get(depName)
          if (!rewrite) {
            console.log('!!!!!!!!!!!!! There is no rewrite for:', depName, 'of:', pkg.name)
            // reactivate the rewrite of link to workspace, but may be a solution to another problem
            rewrite = { version: depVersion.replace('link:', 'workspace:') }
            // this is a workaround for pnpm while pnpm break recursive start on workspace: 
            // console.log(`In the package "${pkg.name}" there is a local link instead of a workspace for this dependency: "${depName}". Do a temp override`)

            // rewrite = {version : depVersion.replace('link:', 'workspace:')}
          }
          // override with the rewrite
          pkg.dependencies[depName] = rewrite.version

        }
        // do nothing with `workspace:` protocol. It's well managed by pnpm, but,
        // in the case of typescript dependency that must be published, we need to override the workspace "simple-copy" to dependency fetch
        if (depVersion.startsWith('workspace:')) {
          if (depName.startsWith('@secretpkg')) {
            let rewrite = rewriteMap.get(depName)
            if (rewrite) {
              pkg.dependencies[depName] = rewrite.version
              console.log('===================', pkg.dependencies)
            }else{
              console.warn('This local typescript dependecy should be published !! A workspace copy will be installed')
            }

          }
        }
      }
      return pkg

    }
  }
}