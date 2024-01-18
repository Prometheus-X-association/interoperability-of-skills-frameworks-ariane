# Interoperability of Skills Frameworks Building Block - ISF BB

- PTX project name : Ariane 
- Contractor : MindMatcher

<<<<<<< HEAD
## Install

* Install (first time): 
`pnpm install` 

* test

## Testing the first things (graphql api) - TO REVIEW

Requirement: you need to have the ismene project folder at the same level of this project folder. You can create a symlink. 

* to install and run 
```
pnpm install
pnpm dev:profile
```

2 instances de Graphql : 

A/ pour le stockage des référentiels : 
* https://jobs-and-skills-v2-dev-wyew76oo4a-ew.a.run.app/graphql
* The target test index will be here: https://dashemploi.kb.europe-west1.gcp.cloud.es.io:9243/app/enterprise_search/app_search/engines/ariane-first-test

B/ ?? Pour le stockage de ??? 

## dataspace-connector

* This is a special service-case where the service's code is under a PTX managed repository (//////////////////// PUT LINK ///////////////////:)
* Run & Documentation: (TO REVIEW)
    * special set-up / install : `ariane/services/dataspace-connector.install.md`
    * Run it locally: `ariane/_docs/Dataspace-connector-Config.md`
    * general Connectors documentation: `ariane/_docs/Dataspace-connector.md`

* Secrets are avaible here: https://www.notion.so/Ariane-104c2578298b803081d5ff82ee24e971


## Ontobridge-API 

///////////////////////// TODO ////////////


## onto-viewer (experiemental)

* objective: graphically review an ontology
* command: (TO CONFIRM)
`cd services/onto-viewer ; pnpm run dev ;`


# Other documentation to review / UPDATE

## Admin-UI

- To live compile `ismeme/` Typescript dependencies and start the `jobsong` services you need to run theses commands:

```
# terminal 1
cd ../ismene
pnpm install
pnpm dev:dependency

# terminal 2
cd ../jobsong
pnpm install
pnpm dev:profile
```

## Token

For now, in Admin-UI and Profile-API, the token is hardcoded.
You can generate new token by running this script (or using postman following that) :
`node services/profile-api/src/utils/getAccessToken.js`.

- Admin-ui : copy the generated token to replace in `jobsong/services/admin-ui/src/App.tsx`.
- Profile-api : add a shared-header in the playground as described by the script.

As a last option comment out the token check in context in `jobsong/services/profile-api/src/utils/getGraphqlComponents.js`

## Deployment

See: \_ops/README.md

## DEV

### Set-up your dev environment

```
cd _ops
node devSetup.js
```

### Graphql package special case

- Graphql package throw an error when it's present 2 times in a project's node_modules.
- In order to get live modifications from the rdfx-graph package, we need to create a pnpm link: `"@mmorg/rdfx-graphql": "link:../../../ismene/packages/rdfx-graphql",`
- This situation lead to 2 graphql packages and throw the error. Even if package version are the same.
- The workaround is to link the graphql package from the `service/profile-api`: `"graphql": "link:../../../ismene/packages/rdfx-graphql/node_modules/graphql",`

- This works for development configuration.

- For publication configuration, calling the published package should works and the link dependency should be removed.

- In case of adding a new dependency to `rdf-*` packages, the graphql resolution migth not work. To get it working you have to :

```
pnpm remove graphql
pnpm add ../../../ismene/packages/rdfx-graphql/node_modules/graphql
```
=======
To run the program :
- run $docker build --pull --rm -f "dockerfile" -t ariane:latest "." :
- then go to the URL specified in the logs (should be 127.0.0.1:8080)

This container can be deployed on any host, given relevant port adjustements

>>>>>>> 9bc259b (added instructions to README.md)
