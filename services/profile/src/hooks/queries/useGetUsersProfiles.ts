import { PersonalDataWallet, User } from "../../__generated__/codegen";

import { BaseListProps } from "@refinedev/core/dist/hooks/data/useList";
import useList from "../useList";

type Props = {
  pagination?: BaseListProps["pagination"];
  search?: string;
};

const useGetUsersProfiles = ({ pagination, search }: Props) => {
  const { data: wallet } = useList<PersonalDataWallet>({
    resourceName: "personalDataWallets",
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
        value: ["given.value"],
      },
    ],
  });

  const { data, isLoading, isError } = useList<User>({
    resourceName: "users",
    pagination,
    filters: [
      {
        field: "id",
        operator: "eq",
        value: wallet
          ?.map((pdw) => pdw.personalDataOf?.[0]?.id)
          .filter(Boolean),
      },
    ],
  });

  return {
    data,
    isLoading,
    isError,
    users: data?.map((item: any, index) => {
      return {
        value: `${item?.id}`,
        label: `${item?.personalData?.[0]?.given?.[0]?.value} ${
          item?.personalData?.[0]?.email?.[0]?.value || ""
        }`,
        customer_token: item?.id,
        first_name: item?.personalData?.[0]?.given?.[0]?.value,
        last_name: item?.personalData?.[0]?.family?.[0]?.value,
        email: item?.personalData?.[0]?.email?.[0]?.value,
      };
    }),
  };
};

export default useGetUsersProfiles;
