import { BaseRecord, useOne as baseUseOne, useResource } from "@refinedev/core"

type UseOneType = {
  resourceName?: string
  id: string
}

const useOne = <T extends BaseRecord>({ resourceName, id }: UseOneType) => {
  const { resource } = useResource(resourceName)
  const { data, isFetching, isError, refetch } = baseUseOne<T>({
    resource: resource?.name,
    meta: resource?.meta?.getOne,
    id,
    queryOptions: {
      enabled: !!id
    }
  })
  // console.log('isLoading useOne', isFetching, resourceName, id)
  return {
    data: data?.data,
    isLoading: isFetching,
    isError,
    refetch
  }
}

export default useOne
