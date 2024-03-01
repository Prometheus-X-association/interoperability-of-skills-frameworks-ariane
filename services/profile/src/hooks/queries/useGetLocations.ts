import { useEffect, useMemo, useRef, useState } from "react";

import { User } from "__generated__/codegen";
import { debounce } from "lodash";

type LocationOption = {
  label: string;
  value: string;
  realValue: {
    city: { value: string }[];
    geolocation: { value: string }[];
  };
};
type RemoteLocationRes = {
  nom: string;
  code: string;
  centre: {
    type: string;
    coordinates: number[];
  };
};

export async function fetchLocations(
  location?: string
): Promise<LocationOption[]> {
  return fetch(
    `https://geo.api.gouv.fr/communes?nom=${
      location || "Paris"
    }&limit=20&fields=code,nom,centre`
  )
    .then((response) => response.json())
    .then((body: RemoteLocationRes[]) => {
      return body?.map?.((item) => {
        return {
          label: item?.nom,
          value: item?.code,
          realValue: {
            city: [{ value: item?.nom }],
            geolocation: [
              {
                value: `${item?.centre?.coordinates?.[0]},${item?.centre?.coordinates?.[1]}`,
              },
            ],
          },
        };
      });
    });
}

const useGetLocations = (userData: User | undefined) => {
  const [fetching, setFetching] = useState(false);
  const [initialLocationData, setInitialLocationData] = useState<any>([]);
  const [locations, setLocations] = useState<any>([]);
  const fetchRef = useRef(0);

  const getLocations = useMemo(() => {
    fetchRef.current += 1;
    const fetchId = fetchRef.current;
    setLocations([]);
    setFetching(true);

    const loadOptions = (value?: string) => {
      fetchLocations(value).then((newLocations) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setLocations(newLocations);
        setFetching(false);
      });
    };
    return debounce(loadOptions, 800);
  }, []);

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  useEffect(() => {
    if (userData?.personalData?.[0]?.location?.length) {
      (async () => {
        const initialLocations = userData?.personalData?.[0]?.location;
        const extraLocations = await Promise.all(
          initialLocations
            .filter(
              (item) => item.city?.[0]?.value && item.geolocation?.[0]?.value
            )
            .map(async (item) => {
              const _list = await fetchLocations(item.city[0].value);
              const _locationDetail = _list.find(
                (l) =>
                  l.realValue.city[0].value === item.city?.[0]?.value &&
                  l.realValue.geolocation[0].value ===
                    item.geolocation?.[0]?.value
              );
              return [item.id, _locationDetail];
            })
        );
        setInitialLocationData(extraLocations);
        console.log("extraLocations", extraLocations);
      })();
    }
  }, [userData, getLocations]);

  return { locations, getLocations, initialLocationData };
};

export default useGetLocations;
