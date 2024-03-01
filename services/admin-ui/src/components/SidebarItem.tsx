import { Link } from "react-router-dom"
import { prettyString } from "@refinedev/inferencer"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/system"
import { SideBarItemProps } from "./Layout"

export const SidebarItem = ({ item }: { item: SideBarItemProps }) => {
  const linkColor = useColorModeValue("blue.500", "blue.200")
  const label = item.labels?.[0]?.value

  if (!item.children?.length && !item.path) {
    return null
  }

  if (!item.children?.length && item.path) {
    return (
      <Box fontWeight="bold" color={linkColor}>
        <Link to={item.path}>{label ?? prettyString(item.name)}</Link>
      </Box>
    )
  }

  return (
    <Accordion allowMultiple>
      <AccordionItem border={0}>
        <AccordionButton pl={0} display="flex" justifyContent="space-between">
          <Box fontWeight="bold">{label ?? prettyString(item.name)}</Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          {item.children!.map((item: any, index: number) => (
            <SidebarItem key={index} item={item} />
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
