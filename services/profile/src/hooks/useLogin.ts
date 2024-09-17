import { Login, QueryLoginArgs } from "../__generated__/codegen";

import { useDataProvider } from "@refinedev/core";
import { useMemo } from "react";

const useLogin = (): (({
  username,
  password,
}: QueryLoginArgs) => Promise<Login>) => {
  const dataProvider = useDataProvider();
  const login = useMemo(() => {
    return dataProvider().login;
  }, []);

  return async ({ username, password }) => await login({ username, password });
};

export default useLogin;
