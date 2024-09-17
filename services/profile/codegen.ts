import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:5020/graphql",
  generates: {
    "./src/__generated__/codegen.ts": {
      plugins: ["typescript"],
    },
  },
};

export default config;
