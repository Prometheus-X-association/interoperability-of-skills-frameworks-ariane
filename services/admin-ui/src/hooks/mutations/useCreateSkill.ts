import { useDataProvider } from "@refinedev/core"
import { nanoid } from "nanoid"
import { useCallback } from "react"

export const useCreateSkill = () => {
  const dataProvider = useDataProvider()

  const mutate = useCallback(async (data: any, companyId: string) => {
    try {
      const { create } = dataProvider()
      const newSkillId = data.id ?? `skill/${companyId}/${nanoid(32)}`
      const res = await create({
        resource: "skills",
        variables: {
          id: newSkillId,
          ...data
        }
      })
      return { id: newSkillId }
    } catch (e: any) {
      console.error("error creating skill", e)
      throw new Error(e.response.errors?.[0]?.message ?? "Error creating skill")
    }
  }, [])

  return {
    mutate
  }
}
