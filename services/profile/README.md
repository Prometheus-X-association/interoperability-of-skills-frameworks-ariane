### Installation and Getting Started
1. Just install dependencies and run the server (please remember to start the profile-api server first)
```bash
pnpm install
pnpm run dev:profile
```
2. Server will serve at port 3002
3. You can access the server at http://localhost:3002

### Data provider
- Currently, the data-provider is from the package @mmorg/rdfx-refine, if we want to extend more queries or mutations, we can add them in the `src/utils/getDataProvider.ts` file.
- For the current implementation, we can only query/mutate on few models that are defined in `public/data/sourceConfiguration.jsonld` file like in admin-ui.
If we need more queries/mutations on existing models, we need to modify the `sourceConfiguration.jsonld` file, then it can generate proper pre-defined fields to be used in data hooks of Refine (useList, useOne, etc...)
- Example usage can be found at `src/pages/homepage/index.tsx`