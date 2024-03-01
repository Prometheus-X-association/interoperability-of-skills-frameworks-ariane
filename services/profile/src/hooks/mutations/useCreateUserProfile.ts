import { useDataProvider } from "@refinedev/core";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { User } from "../../__generated__/codegen";

import { DeepPartial } from "../../types";

const useCreateUserProfile = () => {
  const dataProvider = useDataProvider();

  /**
   * Before creating a user profile, it is expected that there is already a keycloak user created,
   * and this hook can only be called in this app if having an access token.
   * It is IMPORTANT since we will create user profile with id using the keycloak user id.
   *
   * Expected access link to the app: `https://localhost:3002?jwt=${accessToken}`
   * We can use decode the access token to get keycloak object, and get the user id its `sub` value,
   * then pass as data.id to this hook.
   */
  const mutate = useCallback(async (data: DeepPartial<User>) => {
    try {
      const { create, update, createMany } = dataProvider();
      const newUserId = data.id ?? `user/${nanoid(15)}`;
      const mirroredUserId = `mirrored/${newUserId}`;

      await create({
        resource: "user",
        variables: {
          id: newUserId,
          searchedUser: [mirroredUserId],
          keycloakId: data.keycloakId,
          workingHour:
            data.workingHour?.map((h) => h?.id).filter(Boolean) ?? [],
          favoriteMissions:
            data.favoriteMissions?.map((h) => h?.id).filter(Boolean) ?? [],
        },
      });
      const { personalData: personalDataWallet, experience, aptitude } = data;
      const location = personalDataWallet?.[0]?.location?.[0];
      let locationId = `location/${nanoid(15)}`;
      if (location) {
        await create({
          resource: "address",
          variables: {
            ...location,
            id: locationId,
          },
        });
      }

      const [createdPersonalData, createdExperiences, createdAptitudes] =
        await Promise.all([
          // create personalData
          create({
            resource: "personalDataWallet",
            variables: {
              ...personalDataWallet?.[0],
              id: `personalDataWallet/${nanoid(15)}`,
              personalDataOf: [newUserId],
              searchedUser: [mirroredUserId],
              location: location ? [locationId] : [],
              certification:
                personalDataWallet?.[0]?.certification
                  ?.map((c) => c?.id)
                  .filter(Boolean) ?? [],
              // habilitation:
              //   personalDataWallet?.[0]?.habilitation
              //     ?.map((c) => c?.id)
              //     .filter(Boolean) ?? [],
            },
          }),
          // create experience
          createMany?.({
            resource: "experience",
            variables:
              experience?.map((exp) => ({
                ...exp,
                id: `experience/${nanoid(15)}`,
                occupation:
                  exp?.occupation?.map((h) => h?.id).filter(Boolean) ?? [],
              })) ?? [],
          }),
          // create aptitudes
          createMany?.({
            resource: "aptitude",
            variables:
              aptitude?.map((apt) => ({
                ...apt,
                id: `aptitude/${nanoid(15)}`,
                habilitation:
                  apt?.habilitation?.map((h) => h?.id).filter(Boolean) ?? [],
              })) ?? [],
          }),
        ]);
      console.log("createdPersonalData", createdPersonalData.data);
      console.log("createdExperiences", createdExperiences?.data);
      console.log("newUserId", newUserId);

      // update user
      await update({
        resource: "user",
        variables: {
          experience: createdExperiences?.data
            ?.map((exp) => exp.id)
            .filter((i) => !!i),
          aptitude: createdAptitudes?.data?.map((apt) => apt.id),
          id: newUserId,
        },
        id: newUserId,
      });
      console.log("newUserId", newUserId);
      return newUserId;
    } catch (e) {
      console.log("e", e);
    }
  }, []);

  const { mutateAsync, isError, isLoading } = useMutation({
    mutationFn: mutate,
  });

  return {
    mutate: mutateAsync,
    isError,
    isLoading,
  };
};

export default useCreateUserProfile;
