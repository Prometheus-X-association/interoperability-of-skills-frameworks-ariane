import "@refinedev/core";

declare module "@refinedev/core" {
  import { Login, QueryLoginArgs } from "../__generated__/codegen";

  export interface DataProvider {
    login: (args: QueryLoginArgs) => Promise<Login>;
  }
}
