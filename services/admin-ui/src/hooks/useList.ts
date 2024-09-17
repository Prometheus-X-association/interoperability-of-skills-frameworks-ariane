import {
  BaseRecord,
  useList as baseUseList,
  useResource
} from "@refinedev/core"
import { UseListProps } from "@refinedev/core/dist/hooks/data/useList"

type UseListType = {
  resourceName: string
} & UseListProps<any, any>
const useList = <T extends BaseRecord>({
  resourceName,
  pagination,
  filters,
  ...rest
}: UseListType) => {
  const { resource } = useResource(resourceName)
  const { data, isFetching, isError } = baseUseList<T>({
    resource: resourceName,
    meta: resource.meta?.getList,
    pagination,
    filters,
    ...rest
  })

  return {
    data: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading: isFetching,
    isError
  }
}

export default useList
