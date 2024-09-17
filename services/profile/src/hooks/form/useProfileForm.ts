import { nanoid } from "nanoid";
import { useCallback } from "react";

const useProfileForm = () => {
  const getPersonalData = useCallback(({ jwtDecoded, userData, values }) => {
    return {
      given: [
        {
          value:
            jwtDecoded?.first_name ||
            userData?.personalData?.[0]?.given?.[0]?.value ||
            "Johnny",
        },
      ],
      family: jwtDecoded?.last_name
        ? [
            {
              value: jwtDecoded?.last_name,
            },
          ]
        : undefined,
      email: jwtDecoded?.email
        ? [
            {
              value: jwtDecoded?.email || "",
            },
          ]
        : undefined,
      preferredDistance: values?.rangesInKm
        ? [
            {
              value: values?.rangesInKm,
            },
          ]
        : undefined,
      certification: values?.caces?.map((item: string) => {
        return {
          id: item,
        };
      }),
      location: values?.locations?.map((item: any, index: number) => {
        return {
          id: userData?.personalData?.[0]?.location?.[index]?.id,
          city: item?.city,
          geolocation: item?.geolocation,
          country: [
            {
              value: "France",
            },
          ],
        };
      }),
    };
  }, []);

  const getAptitude = useCallback(({ values }) => {
    return {
      habilitation: values?.habilitations?.map((item: string) => {
        return {
          id: item,
        };
      }),
    };
  }, []);

  const getExperiencesBody = useCallback(({ values, userData }) => {
    return values?.jobs
      ?.map((item: any, index: number) => {
        return {
          id: userData?.experience?.[index]?.id,
          title: [{ value: item?.name?.label }],
          occupation: [{ id: item?.name?.value }],
          duration: [{ value: item?.duration }],
        };
      })
      .filter((item: any) => item?.title && item?.title !== "undefined");
  }, []);

  const getUpdateProfileBody = useCallback(
    ({ userData, values, jwtDecoded }) => {
      return {
        personalData: [
          {
            ...userData?.personalData?.[0],
            ...getPersonalData({ userData, values, jwtDecoded }),
          },
        ],
        aptitude: [
          {
            ...userData?.aptitude?.[0],
            ...getAptitude({ values }),
          },
        ],
        ...(jwtDecoded || userData?.keycloakId?.[0]?.value
          ? {
              keycloakId: [
                { value: userData?.keycloakId?.[0]?.value ?? jwtDecoded?.sub },
              ],
            }
          : {}),
      };
    },
    [],
  );

  const getCreateProfileBody = useCallback(
    ({ userId, userData, values, jwtDecoded }) => {
      return {
        id: userId || `user/${nanoid(15)}`,
        ...(jwtDecoded ? { keycloakId: [{ value: jwtDecoded?.sub }] } : {}),
        personalData: [getPersonalData({ userData, values, jwtDecoded })],
        aptitude: [getAptitude({ values })],
        experience: getExperiencesBody({ values, userData }),
      };
    },
    [],
  );

  const getInitialValues = useCallback(
    ({ userData, jwtDecoded, initialLocationData }) => {
      const values = {
        keycloakId:
          userData?.keycloakId?.[0]?.value ?? jwtDecoded?.sub
            ? [
                {
                  value:
                    userData?.keycloakId?.[0]?.value ?? jwtDecoded?.sub ?? "",
                },
              ]
            : undefined,
        jobs: userData?.experience?.map((item) => {
          return {
            name: {
              value: item?.occupation?.[0]?.id,
              label: item?.occupation?.[0]?.prefLabel?.[0]?.value,
            },
            duration: item?.duration?.[0]?.value,
            key: item?.id,
          };
        }),
        locations: userData?.personalData?.[0]?.location
          ?.map((item) => {
            const initialLocation = initialLocationData.find(
              (l) => l[0] === item.id,
            );
            if (!initialLocation) {
              return null;
            }
            return {
              id: item?.id,
              value: initialLocation[1].value,
              city: item?.city,
              geolocation: item?.geolocation,
            };
          })
          .filter(Boolean),
        zones: userData?.personalData?.[0]?.location
          ?.map((item) => {
            const initialLocation = initialLocationData.find(
              (l) => l[0] === item.id,
            );
            if (!initialLocation) {
              return null;
            }
            return {
              label: item?.city?.[0]?.value,
              value: initialLocation[1].value,
            };
          })
          .filter((item) => {
            return item?.label;
          }),
        caces: userData?.personalData?.[0]?.certification?.map(
          (item) => item?.id,
        ),
        habilitations: userData?.aptitude?.[0]?.habilitation?.map(
          (item) => item?.id,
        ),
        rangesInKm: userData?.personalData?.[0]?.preferredDistance?.[0]?.value,
      };

      return values;
    },
    [],
  );

  return {
    getExperiencesBody,
    getUpdateProfileBody,
    getCreateProfileBody,
    getInitialValues,
  };
};

export default useProfileForm;
