import useList from "../useList"

export const useSearchSkillsByCompany = (
  companyId?: string,
  shouldQuery: boolean = true
) => {
  const { data, isLoading, isError } = useList({
    resourceName: "skills",
    pagination: {
      pageSize: 40
    },
    filters: [
      {
        field: "company",
        operator: "eq",
        value: [companyId]
      }
    ],
    queryOptions: {
      enabled: !!companyId && !!shouldQuery,
      select: (data) => {
        return {
          data:
            data?.data?.sort((a, b) =>
              a.prefLabel?.[0]?.value.localeCompare(b.prefLabel?.[0]?.value)
            ) ?? [],
          total: data?.total ?? 0
        }
      }
    }
  })
  return {
    skills: data ?? [],
    isLoading,
    isError
  }
}
