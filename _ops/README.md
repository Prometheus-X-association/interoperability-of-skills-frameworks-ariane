
# Set-up your dev environment

```
cd _ops
node devSetup.js
```

# Deploy to online-dev instance 

```
cd _ops
node deploy.js
```

- url: https://profile-api-dev-wyew76oo4a-ew.a.run.app/

# How works the deploy script ? 

* This script execute the required steps to deploy a multi-services app ; Starting from multi-mono-repos package's publish to Cloud Run deployment. 
* Main steps are :
  - publishDep
    * It check deps that have to be published and create an `index dependencies to rewrite during install`(rewrites). This index is required to keep the depencies with `links` protocols in the `package.json`. This index is created by a pnpm hook: `_ops/.pnpmfile.cjs`
  - installApp
    * It install the `multi-services app` (app) structure, so services can be deployed 'in place'.
  - deployService 
    * It call the `pnpm deploy` command on the services. The deployed services are generated in the `app/service` folder. The `rewrites` are applied throw the `.pnpmfile.cjs` hook.
  - e2eLocal
    * Start the local composed app.
  - dockerBuild & e2eDocker
    * Copy the composed app into docker & start a local instance to allow checks
  - publishApp
    * tag and push the docker image. Update the Cloud Runner.

# Possibles improvements

* improve refine's cra build compilation. It use only 1 CPU, and so long to compile.
* use a unique pnpm store at the "app" level for all the `deployable` services ? 
* create a set of basic http tests for the e2e steps. 
* Improve docker copy/add to create layers from `node_modules`
* Split terminal to display multiple sub-processes output (for example: `stoppable sub-process` & `e2e tests`). See `npkill` code for examples.

* add the publishable-with-types-structure like (https://gitlab.com/mmorg/gen-scan/genmain/-/blob/7ecb8b45736366f9f4fcf04b0602c6b93a5f74de/bfback-manager)

# Remarks:
- this ops package is copy-pasted into `ismene` also. @TODO: create a reusable package from one or the other