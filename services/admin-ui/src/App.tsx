import {
  CommonList,
  Create,
  Edit,
  getDataProviderHref,
  getDeployedFullPath,
  getDeployedPathname,
  getResources,
  MainContextProvider,
  Show,
  useMainContext
} from "@mmorg/rdfx-refine"
import { useEffect, useMemo, useState } from "react"
import { GraphQLClient } from "@refinedev/graphql"
import { Refine, ResourceProps } from "@refinedev/core"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import routerBindings from "@refinedev/react-router-v6"
import { ChakraProvider } from "@chakra-ui/react"
import CompanyDetailForm from "./components/company/CompanyDetailForm"
import JobDetailForm from "./components/job/JobDetailForm"
import SkillDetailForm from "./components/skill/SkillDetailForm"
import { MainPage } from "./pages/Main"
import { Layout } from "./components/Layout"
import finalOntology from "final-ontology"
import LoginPage from "./pages/Login"
import { getDataProvider } from "./utils/getDataProvider"
import { refineTheme } from "@refinedev/chakra-ui"
import { Notifications } from "@mantine/notifications"
import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"

const App = () => {
  const [worldOntology, setWorldOntology] = useState()
  const location = window.location
  const { protocol, hostname, port } = location

  const httpDir = getDeployedPathname(location)
  const deployedFullPath = `${protocol}//${hostname}:${port}${httpDir}`

  useEffect(() => {
    setWorldOntology(finalOntology)
  }, [])

  if (!worldOntology) {
    return null
  }

  return (
    <MainContextProvider
      tokenKey="admin-ui"
      worldOntology={worldOntology}
      editConfigPath={deployedFullPath + "/data/editConfiguration.ld.json"}
      tableConfigPath={deployedFullPath + "/data/tableConfiguration.ld.json"}
      navigationConfigPath={
        deployedFullPath + "/data/navigationConfiguration.ld.json"
      }
    >
      <Content />
    </MainContextProvider>
  )
}

export default App

const formPageMap = {
  companies: <CompanyDetailForm key="companies" />,
  jobs: <JobDetailForm key="jobs" />,
  skills: <SkillDetailForm key="skillss" />
}

const Content = () => {
  const [resources, setResources] = useState<ResourceProps[]>([])

  const { token } = useMainContext()
  const dataProviderHref = useMemo(() => getDataProviderHref(), [])

  const deployedFullPath = useMemo(() => getDeployedFullPath(), [])

  const httpDir = useMemo(() => getDeployedPathname(window.location), [])
  const basename = { basename: httpDir }
  const client = useMemo(
    () =>
      new GraphQLClient(`${dataProviderHref}/graphql`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
    [token]
  )
  const _dataProvider = useMemo(() => {
    return getDataProvider(client, {
      onTokenInvalid: () => {
        window.localStorage.setItem("admin-ui-token", "")
        window.dispatchEvent(new StorageEvent("storage"))
      }
    })
  }, [client])

  useEffect(() => {
    ;(async () => {
      setResources(
        await getResources(
          deployedFullPath + "/data/tableConfiguration.ld.json",
          finalOntology
        )
      )
    })()
  }, [])

  if (!resources.length) {
    return null
  }

  return (
    <MantineProvider>
      <ChakraProvider theme={refineTheme}>
        <BrowserRouter {...basename}>
          <Refine
            routerProvider={routerBindings}
            dataProvider={_dataProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true
            }}
            resources={resources.map((r) => ({
              ...r,
              identifier: r.name
            }))}
          >
            <Notifications position="top-right" />
            <Routes>
              <Route path={"/login"} element={<LoginPage />} />
              <Route element={<Layout />}>
                <Route index element={<MainPage />} />
                {resources.map((resource) => {
                  return (
                    <Route key={resource.name} path={`/${resource.name}`}>
                      <Route
                        index
                        element={<CommonList key={resource.name} />}
                      />
                      <Route
                        path="create"
                        //  TODO : make it dynamic list
                        element={
                          formPageMap[
                            resource.name as keyof typeof formPageMap
                          ] ?? <Create key={resource.name} />
                        }
                      />
                      <Route
                        path=":id/edit"
                        element={
                          formPageMap[
                            resource.name as keyof typeof formPageMap
                          ] ?? <Edit key={resource.name} />
                        }
                      />
                      <Route
                        path=":id/show"
                        element={
                          formPageMap[
                            resource.name as keyof typeof formPageMap
                          ] ?? <Show key={resource.name} />
                        }
                      />
                    </Route>
                  )
                })}
                <Route path="*" element={<div>Not Found</div>} />
              </Route>
            </Routes>
          </Refine>
        </BrowserRouter>
      </ChakraProvider>
    </MantineProvider>
  )
}
