DOC TO UPDATE 

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
