import { Button, Flex, Input } from "@mantine/core";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AppContext } from "Store";
import { Select } from "antd";
import { debounce } from "lodash";
import { nanoid } from "nanoid";
import useGetUsersProfiles from "hooks/queries/useGetUsersProfiles";

export const DebugContext = createContext({});


const CreateNewUser = async (user?: any) => {
  const rand = nanoid(10);
  const resp = await fetch(
    "https://app-devonline-wyew76oo4a-ew.a.run.app/addviseo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Login": "addviseo",
        "X-Auth-Token": "4e081db97d2503774234e80010bcfd46",
      },
      body: JSON.stringify({
        resource_type: "show_profile",
        customer_token: `rand-${rand}`,
        last_name: rand,
        email: `${user.first_name}.${rand}@rand.com`,
        ...user,
      }),
    }
  );

  const graphqlEndpoint = await resp.text();
  return graphqlEndpoint;
};

const Debug = (props) => {
  const { className, children, ...attr } = props;
  const {
    userId,
    setUserId,
    jwtDecoded,
    userData,
    refetchUserProfile,
    setJWTDecoded,
  } = useContext(AppContext) as any;
  const { createUserProfile, updateUserProfile, locations, jobs, missionData } =
    useContext(DebugContext) as any;

  const [displayDebug,setdisplayDebug]=useState(false)
  const [display, setdisplay] = useState(false);
  const debugBlackList = 'app-dev-wyew76oo4a-ew'
  const hostName = window.location.hostname

  const [name, setName] = useState("Randy");
  const rand = nanoid(10);
  const [userToConnect, setUserToConnect] = useState({
    sub: rand,
    first_name: "Randy",
    last_name: rand,
    email: `Randy.${rand}@rand.com`,
  });

  useEffect(() => {
    if (jwtDecoded?.sub) setUserToConnect(jwtDecoded);
  }, [jwtDecoded]);

  useEffect(()=>{
    if(!hostName.includes(debugBlackList)) setdisplayDebug(true)
  },[])

  const [usersKeyword, setUsersKeyword] = useState("");

  const { data, users, isLoading } = useGetUsersProfiles({
    pagination: {
      pageSize: 20,
      current: 1,
    },
    search: usersKeyword,
  });

  const onUsersSearch = useMemo(() => {
    return debounce(
      (key: string) => {
        setUsersKeyword(key);
      },
      800,
      { leading: true }
    );
  }, []);

  return (
    <div
      {...attr}
      style={{
        position: "fixed",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "top",
        width: "400px",
        top: 0,
        right: 0,
        bottom: 0,
        padding: "20px",
        textAlign: "left",
      }}
    >
      {displayDebug &&
      <small
        style={{
          cursor: "pointer",
          position: "fixed",
          bottom: 0,
          right: 0,
        }}
        onClick={() => setdisplay(!display)}
      >
        debug
      </small>}
      {display && (
        <Flex direction="column" justify="space-around" w="100%" gap="20px">
          <Flex direction="column">
            <Select
              style={{ marginBottom: "20px" }}
              showSearch
              notFoundContent={
                isLoading ? "En cours de chargement" : "0 utilisateurs"
              }
              options={users}
              optionFilterProp="label"
              onSearch={(k) => {
                onUsersSearch(k);
              }}
              onChange={(value) => {
                console.log("value", value);
                const user = users?.find((u) => u?.customer_token === value);
                setUserToConnect({
                  sub: user?.customer_token,
                  first_name: user?.first_name,
                  last_name: user?.last_name,
                  email: user?.email,
                });
              }}
            />
            <Input.Wrapper label="First Name" mb="md">
              <Input
                value={userToConnect?.first_name}
                onChange={(e) => {
                  const value = e?.currentTarget?.value;
                  setUserToConnect((prev) => {
                    return {
                      ...prev,
                      first_name: value,
                      email: `${value}.${prev?.last_name}@rand.com`,
                    };
                  });
                }}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Last Name" mb="md">
              <Input
                value={userToConnect?.last_name}
                onChange={(e) => {
                  const value = e?.currentTarget?.value;
                  setUserToConnect((prev) => {
                    return {
                      ...prev,
                      last_name: value,
                      email: `${prev?.first_name}.${value}@rand.com`,
                    };
                  });
                }}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Email" mb="md">
              <Input
                value={userToConnect?.email}
                onChange={(e) => {
                  const value = e?.currentTarget?.value;
                  setUserToConnect((prev) => {
                    return {
                      ...prev,
                      email: value,
                    };
                  });
                }}
              />
            </Input.Wrapper>
            <Button
              mt="md"
              onClick={() => {
                console.log("userToConnect", userToConnect);
                setJWTDecoded(userToConnect);
                setUserId(userToConnect?.sub);
              }}
            >
              Update on screen
            </Button>
          </Flex>

          <Flex direction="column" justify="space-around" gap="16px">
            <Button
              onClick={() => {
                setTimeout(async () => {
                  refetchUserProfile?.();
                }, 1000);
              }}
            >
              Refresh
            </Button>
            <Button
              onClick={async () => {
                setUserId("");
                setJWTDecoded({});
                refetchUserProfile?.();
              }}
            >
              Remove user
            </Button>
            <Button
              onClick={() => {
                console.log("userToConnect", userToConnect);
                console.log("users", users);
                console.log("userId", userId);
                console.log("userData", userData);
                console.log("locations", locations);
                console.log("location", location);
                console.log("jobs", jobs);
                console.log("jwtDecoded", jwtDecoded);
                console.log("name", name);
              }}
            >
              Show data
            </Button>
            <Button
              onClick={() => {
                console.log("missionData", missionData);
              }}
            >
              Show Missions
            </Button>
          </Flex>
          {/* <Button
            disabled
            onClick={async () => {
              const response = await login({
                username: "test",
                password: "test",
              });
              if (response?.accessToken) {
                const jwtDecoded: any = jwt_decode(
                  response?.accessToken as string
                );
                setJWTDecoded(jwtDecoded);
                setUserId(jwtDecoded?.sub);
              }
            }}
          >
            Login as id:test mdp:test
          </Button> */}
          {/* {updateUserProfile && (
            <Button
              onClick={async () => {
                const newUserId = await updateUserProfile(
                  mockUserProfileFromValuesFormEdition
                );

                setUserId?.(newUserId ?? "");
                setTimeout(async () => {
                  refetchUserProfile?.();
                }, 1000);
                // navigate("/missions");
              }}
            >
              Update user profile with mock
            </Button>
          )}
          {createUserProfile && (
            <Button
              onClick={async () => {
                const newUserId = await createUserProfile(
                  mockUserProfileFromValuesFormCreation
                );

                setUserId(newUserId ?? "");
                setTimeout(async () => {
                  refetchUserProfile?.();
                }, 1000);
                // navigate("/missions");
              }}
            >
              Create user profile with mock
            </Button>
          )} */}
        </Flex>
      )}
    </div>
  );
};

export default Debug;
