import useList from "../useList"

export const useSearchCompaniesByName = (search?: string) => {
  const { data, isLoading, isError } = useList({
    resourceName: "companies",
    pagination: {
      pageSize: 20
    },
    ...(search && {
      filters: [
        {
          field: "query",
          operator: "eq",
          value: `${search}`
        },
        {
          field: "searchField",
          operator: "eq",
          value: ["companyName.value"]
        }
      ]
    })
  })

  return {
    companies: data ?? [],
    isLoading,
    isError
  }
}
