import { useDataProvider } from "@refinedev/core"
import { useCallback } from "react"

export const useUpdateSkill = (id?: string) => {
  const dataProvider = useDataProvider()

  const mutate = useCallback(
    async (_data: any) => {
      if (!id) return
      const { company, ...data } = _data
      try {
        const { update } = dataProvider()
        const res = await update({
          resource: "skills",
          id,
          variables: {
            id,
            ...data
          }
        })
        return { id }
      } catch (e: any) {
        console.error("error updating skill", e)
        throw new Error(
          e.response.errors?.[0]?.message ?? "Error updating skill"
        )
      }
    },
    [id, dataProvider]
  )

  return {
    mutate
  }
}
