import { User } from "../../__generated__/codegen";
import useOne from "../useOne";

const useGetUserProfile = (userId: string) => {
  const { data, isLoading, isError, refetch } = useOne<User>({
    resourceName: "users",
    id: userId,
  });
  // * console.log('isLoading useGetUserProfile', isLoading)
  return { data, isLoading, isError, refetch };
};

export default useGetUserProfile;
