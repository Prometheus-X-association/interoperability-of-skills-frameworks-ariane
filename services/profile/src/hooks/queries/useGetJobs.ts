import { BaseListProps } from "@refinedev/core/dist/hooks/data/useList";
import { useMemo } from "react";
import { Job, Position } from "../../__generated__/codegen";
import useList from "../useList";

type Props = {
  pagination?: BaseListProps["pagination"];
  search?: string;
};
const useGetJobs = ({ pagination, search }: Props) => {
  const { data: jobs, isLoading: isJobsLoading } = useList<Job>({
    resourceName: "employment/job",
    pagination,
    filters: [
      {
        field: "query",
        operator: "eq",
        value: `${search}`,
      },
      {
        field: "searchField",
        operator: "eq",
        value: ["prefLabel.value"],
      },
    ],
  });
  const { data: positions, isLoading: isPositionsLoading } = useList<Position>({
    resourceName: "employment/position",
    pagination,
    filters: [
      {
        field: "query",
        operator: "eq",
        value: `${search}`,
      },
      {
        field: "searchField",
        operator: "eq",
        value: ["prefLabel.value"],
      },
    ],
  });

  const data = useMemo(
    () => [...(jobs ?? []), ...(positions ?? [])],
    [jobs, positions],
  );

  // TODO: this is just temporary
  return {
    data,
    isLoading: isPositionsLoading || isJobsLoading,
    jobs: data?.map((item: any) => {
      return {
        value: item?.id,
        label: item?.prefLabel?.[0]?.value,
      };
    }),
  };
};

export default useGetJobs;
