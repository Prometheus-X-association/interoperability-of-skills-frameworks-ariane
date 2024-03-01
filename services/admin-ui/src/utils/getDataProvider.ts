import { getDataProvider as baseGetDataProvider } from "@mmorg/rdfx-refine";
import { BaseRecord } from "@refinedev/core";
import { GraphQLClient } from "@refinedev/graphql";
import * as gql from "gql-query-builder";

export const getDataProvider = (client: GraphQLClient, options: any) => {
  return {
    ...baseGetDataProvider(client, options),
    login: async ({ username, password }: any) => {
      const { query, variables } = gql.query({
        operation: "Login",
        variables: {
          username: { value: username, type: "String", required: true },
          password: { value: password, type: "String", required: true },
        },
        fields: ["accessToken"],
      });

      const response = await client.request<BaseRecord>(query, variables);

      return response?.Login;
    },
  };
};
