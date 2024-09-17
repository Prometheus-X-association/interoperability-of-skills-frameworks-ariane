import { useNavigation, useResource } from "@refinedev/core"
import { Box } from "@chakra-ui/react"
import { HamburgerIcon } from "@chakra-ui/icons"
import React, { memo, PropsWithChildren, useMemo, useState } from "react"
import { prettyString } from "@refinedev/inferencer"
import { Link, Outlet } from "react-router-dom"
import { SidebarItem } from "./SidebarItem"
import { useColorModeValue } from "@chakra-ui/system"
// @ts-ignore
import { useMainContext } from "@mmorg/rdfx-refine"
// TODO : bug with jsx when import ds_mindmatcher ? react version conflicts ?
import { Button } from "@mmorg/ds_mindmatcher"

export type SideBarItemProps = {
  name: string
  path?: string
  labels?: {
    value: string
    language: string
  }[]
  children?: SideBarItemProps[]
}

export const Layout = memo(({ children }: PropsWithChildren<{}>) => {
  const [openSideBar, setOpenSideBar] = useState(true)
  const { resources } = useResource()
  const linkColor = useColorModeValue("blue.500", "blue.200")
  const { navigationConfiguration, token } = useMainContext()

  const sidebarItems: SideBarItemProps[] = useMemo(() => {
    if (!navigationConfiguration) return []
    const navigationConfigurationGraph = navigationConfiguration?.["graph"]
    const navigationItemDefs = navigationConfigurationGraph?.filter(
      (item: any) => item["@type"]?.includes("mms:Navigation")
    )
    const root = navigationItemDefs.find((def: any) => def["@id"] === "na:root")

    if (!root?.member?.length) return []

    const generatePath = (navigationDef: any) => {
      if (!navigationDef) {
        return null
      }
      const resource = resources.find(
        (r: any) => r.resourceType === navigationDef.description
      )
      const path = resource?.list
      return {
        name: resource?.name,
        labels: navigationDef.prefLabel,
        path,
        children: navigationDef.member
          ?.map((m: any) =>
            generatePath(
              navigationItemDefs.find((def: any) => def["@id"] === m)
            )
          )
          .filter((m: any) => !!m)
      }
    }

    return root.member
      .map((m: any) =>
        generatePath(navigationItemDefs.find((def: any) => def["@id"] === m))
      )
      .filter((m: any) => !!m)
  }, [navigationConfiguration, resources])

  const { push } = useNavigation()
  // useEffect(() => {
  //   if (!token) {
  //     push("/login");
  //   }
  // }, [token]);

  if (!sidebarItems?.length) return null
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        width: "100vw"
      }}
    >
      <Box
        sx={{
          width: "100vw",
          height: "5rem",
          padding: "0.75rem 1.5rem",
          flexShrink: 0,
          borderBottom: "1px solid black",
          display: "flex",
          alignItems: "center"
        }}
      >
        <HamburgerIcon
          fontSize="2rem"
          cursor="pointer"
          onClick={() => setOpenSideBar((prev) => !prev)}
        />
      </Box>
      <Box
        sx={{
          flex: "1",
          minHeight: 0,
          display: "flex",
          height: "100%",
          width: "100%",
          overflow: "hidden"
        }}
      >
        <Box
          style={{
            position: "relative",
            width: openSideBar ? "300px" : 0,
            opacity: openSideBar ? 1 : 0,
            overflow: "hidden",
            transition: openSideBar
              ? "width 0.8s, opacity 3s"
              : "width 0.8s, opacity 0.4s"
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              padding: "1rem 1rem 1rem 1.5rem",
              borderRight: "1px solid black"
            }}
          >
            <Box fontWeight="bold" color={linkColor}>
              <Link to="/">{prettyString("Homepage")}</Link>
            </Box>
            {sidebarItems.map((item: any, index: number) => (
              <SidebarItem key={index} item={item} />
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            padding: "1rem",
            overflow: "auto"
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
})
