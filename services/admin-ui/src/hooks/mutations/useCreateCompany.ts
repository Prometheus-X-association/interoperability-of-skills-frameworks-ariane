import { useDataProvider } from "@refinedev/core"
import { nanoid } from "nanoid"
import { useCallback } from "react"

export const useCreateCompany = () => {
  const dataProvider = useDataProvider()

  const mutate = useCallback(async (data: any) => {
    try {
      const { create } = dataProvider()
      const newCompanyId = data.id ?? `company/${nanoid(15)}`
      const res = await create({
        resource: "companies",
        variables: {
          id: newCompanyId,
          ...data
        }
      })
      return { id: newCompanyId }
    } catch (e: any) {
      console.error("error creating company", e)
      throw new Error(
        e.response.errors?.[0]?.message ?? "Error creating company"
      )
    }
  }, [])

  return {
    mutate
  }
}
