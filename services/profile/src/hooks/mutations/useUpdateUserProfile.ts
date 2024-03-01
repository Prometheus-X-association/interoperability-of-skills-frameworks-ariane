import { useDataProvider } from "@refinedev/core";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { User } from "../../__generated__/codegen";
import { DeepPartial } from "../../types";

const useUpdateUserProfile = (id: string) => {
  const dataProvider = useDataProvider();

  const mutate = useCallback(
    async ({
      data,
      originalData,
    }: {
      data: DeepPartial<User>;
      originalData?: DeepPartial<User>;
    }) => {
      const { personalData, aptitude, favoriteMissions, matchingMissions } =
        data;
      const mirroredUserId = `mirrored/${id}`;
      try {
        const updatedUserPayload: any = {
          id,
          ...(data.keycloakId?.[0]?.value !==
          originalData?.keycloakId?.[0]?.value
            ? { keycloakId: data.keycloakId }
            : null),
        };
        const { create, createMany, update, updateMany } = dataProvider();

        /**
         * Edit aptitude / habilitation
         */
        if (aptitude?.length) {
          const aptitudePayload = aptitude.map((a) => ({
            ...a,
            habilitation:
              a.habilitation?.map((h) => h?.id).filter(Boolean) ?? [],
          }));
          const existingAptitudes = aptitudePayload.filter((a) => a.id);

          // Only save aptitude that changed
          const updatedAptitudes = existingAptitudes.filter((a) => {
            const originalAptitude = originalData?.aptitude?.find(
              (a2) => a2?.id === a.id,
            );
            if (
              originalAptitude?.habilitation?.length !== a.habilitation?.length
            )
              return true;

            return !originalAptitude.habilitation
              .map((h) => h?.id)
              .every((hId) => a.habilitation?.includes(hId));
          });
          const newAptitudes = aptitudePayload
            .filter((a) => !a.id)
            .map((a) => ({
              ...a,
              id: `aptitude/${nanoid(15)}`,
            }));
          await Promise.all([
            ...(newAptitudes.length
              ? [
                  createMany({
                    resource: "aptitude",
                    variables: newAptitudes,
                  }),
                ]
              : []),
            ...(updatedAptitudes.length
              ? [
                  updateMany({
                    resource: "aptitude",
                    ids: updatedAptitudes.map((a) => a.id),
                    variables: updatedAptitudes,
                  }),
                ]
              : []),
          ]);

          if (newAptitudes.length || updatedAptitudes.length) {
            updatedUserPayload.aptitude = [
              ...existingAptitudes,
              ...newAptitudes,
            ].map((a) => a.id);
            console.log("aptitudePayload", aptitudePayload);
          }
        }

        /**
         * Edit personal data
         */
        console.log("personalData", personalData);
        if (personalData?.length) {
          let shouldUpdatePersonalData = false;
          const locationIds = [];
          const pData = personalData[0];
          const originalPersonalData = originalData?.personalData?.[0];
          /** Update location **/
          if (pData.location?.length) {
            const existingLocations = pData.location.filter((l) => l?.id);
            const updatedLocations = existingLocations.filter((l) => {
              const originalLocation = originalPersonalData?.location?.find(
                (l2) => l2?.id === l.id,
              );
              if (!originalLocation) return true;
              return (
                originalLocation.geolocation?.[0]?.value !==
                l.geolocation?.[0]?.value
              );
            });

            shouldUpdatePersonalData =
              shouldUpdatePersonalData || updatedLocations.length > 0;
            const newLocations = pData.location
              .filter((l) => !l?.id)
              .map((l) => ({
                ...l,
                id: `location/${nanoid(15)}`,
              }));
            shouldUpdatePersonalData =
              shouldUpdatePersonalData || newLocations.length > 0;
            await Promise.all([
              ...(newLocations.length
                ? [
                    createMany({
                      resource: "address",
                      variables: newLocations,
                    }),
                  ]
                : []),
              ...(updatedLocations.length
                ? [
                    updateMany({
                      resource: "address",
                      ids: updatedLocations.map((a) => a.id),
                      variables: updatedLocations,
                    }),
                  ]
                : []),
            ]);
            locationIds.push(
              ...existingLocations.map((l) => l.id),
              ...newLocations.map((l) => l.id),
            );
          }

          const originalLocationIds =
            originalPersonalData?.location?.map((l) => l?.id).filter(Boolean) ??
            [];
          const originalCertificationIds =
            originalPersonalData?.certification
              ?.map((c) => c?.id)
              .filter(Boolean) ?? [];
          const certificationIds =
            pData.certification?.map((c) => c?.id).filter(Boolean) ?? [];

          shouldUpdatePersonalData =
            shouldUpdatePersonalData ||
            !originalPersonalData ||
            originalLocationIds.length !== locationIds.length ||
            !originalLocationIds.every((lId) => locationIds.includes(lId)) ||
            originalCertificationIds.length !== certificationIds.length ||
            !originalCertificationIds.every((cId) =>
              certificationIds.includes(cId),
            ) ||
            originalPersonalData.email?.[0]?.value !==
              pData.email?.[0]?.value ||
            originalPersonalData.given?.[0]?.value !==
              pData.given?.[0]?.value ||
            originalPersonalData.family?.[0]?.value !==
              pData.family?.[0]?.value ||
            originalPersonalData.preferredDistance?.[0]?.value !==
              pData.preferredDistance?.[0]?.value;

          if (shouldUpdatePersonalData) {
            const personalDataPayload = {
              ...pData,
              personalDataOf: [id],
              searchedUser: [mirroredUserId],
              location: locationIds,
              certification:
                pData.certification?.map((c) => c?.id).filter(Boolean) ?? [],
            };
            // console.log("personalData[0]?.id", personalData[0]?.id);
            // console.log("pData", pData);
            // console.log("personalDataPayload", personalDataPayload);
            /** Update personal data **/
            let personalDataId = pData.id ?? `personalDataWallet/${nanoid(15)}`;
            if (pData.id) {
              await update({
                id: personalDataId as string,
                resource: "personalDataWallet",
                variables: personalDataPayload,
              });
            } else {
              await create({
                resource: "personalDataWallet",
                variables: {
                  ...personalDataPayload,
                  id: personalDataId,
                },
              });
            }
            updatedUserPayload.personalData = [personalDataId];
          }
        }

        // favorite mission
        if (favoriteMissions) {
          updatedUserPayload.favoriteMissions = favoriteMissions
            .map((fm) => fm?.id)
            .filter(Boolean);
        }
        // console.log("updatedUserPayload", updatedUserPayload);
        if (Object.keys(updatedUserPayload).length > 1) {
          await update({
            id,
            resource: "User",
            variables: updatedUserPayload,
          });
        }

        return id;
      } catch (e) {
        console.error(e);
      }
    },
    [id],
  );

  const { mutateAsync, isError, isLoading } = useMutation({
    mutationFn: mutate,
    mutationKey: [id, "updateUserProfile"],
  });

  return {
    mutate: mutateAsync,
    isError,
    isLoading,
  };
};

export default useUpdateUserProfile;
