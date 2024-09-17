import { Refine, ResourceProps } from "@refinedev/core";
import {
  getDataProviderHref,
  getDeployedFullPath,
  getDeployedPathname,
  getResources,
} from "@mmorg/rdfx-refine";
import { useLayoutEffect, useMemo, useState } from "react";

import { GraphQLClient } from "@refinedev/graphql";
import finalOntology from "final-ontology";
import { getDataProvider } from "./utils/getDataProvider";
import { notificationProvider } from "@refinedev/mantine";
import routerBindings from "@refinedev/react-router-v6";

const RefineWrapper = ({ children }) => {
  const [resources, setResources] = useState<ResourceProps[]>([]);
  const dataProviderHref = useMemo(() => getDataProviderHref(), []);

  const deployedFullPath = useMemo(() => getDeployedFullPath(), []);

  const graphqlClient = useMemo(
    () => new GraphQLClient(`${dataProviderHref}/graphql`),
    [dataProviderHref]
  );

  const _dataProvider = useMemo(() => {
    return getDataProvider(graphqlClient);
  }, [graphqlClient]);

  useLayoutEffect(() => {
    (async () => {
      setResources(
        await getResources(
          deployedFullPath + "/data/sourceConfiguration.jsonld",
          finalOntology
        )
      );
    })();
  }, []);

  // console.log("resources", resources);
  if (!resources.length) {
    return null;
  }

  return (
    <Refine
      dataProvider={_dataProvider}
      routerProvider={routerBindings}
      notificationProvider={notificationProvider}
      resources={resources}
      options={{
        syncWithLocation: true,
      }}
    >
      {children}
    </Refine>
  );
};

export default RefineWrapper;
