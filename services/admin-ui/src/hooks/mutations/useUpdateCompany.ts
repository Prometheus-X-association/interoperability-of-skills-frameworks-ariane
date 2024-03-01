import { useDataProvider } from "@refinedev/core"
import { useCallback } from "react"

export const useUpdateCompany = (id?: string) => {
  const dataProvider = useDataProvider()

  const mutate = useCallback(
    async (_data: any) => {
      if (!id) return
      const { services, ...data } = _data
      try {
        const { update } = dataProvider()
        const res = await update({
          resource: "companies",
          id,
          variables: {
            id,
            ...data
          }
        })
        return { id }
      } catch (e: any) {
        console.error("error updating company", e)
        throw new Error(
          e.response.errors?.[0]?.message ?? "Error updating company"
        )
      }
    },
    [id, dataProvider]
  )

  return {
    mutate
  }
}
