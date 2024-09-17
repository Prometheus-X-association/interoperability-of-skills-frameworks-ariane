import { useList as baseUseList, useResource } from "@refinedev/core";
import { BaseListProps } from "@refinedev/core/dist/hooks/data/useList";

type UseListType = {
  resourceName: string;
} & BaseListProps;
const useList = <T>({ resourceName, pagination, filters }: UseListType) => {
  const { resource } = useResource(resourceName);
  const { data, isFetching, isError } = baseUseList<T>({
    resource: resourceName,
    meta: resource.meta?.getList,
    pagination,
    filters,
  });

  return {
    data: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading: isFetching,
    isError,
  };
};

export default useList;
