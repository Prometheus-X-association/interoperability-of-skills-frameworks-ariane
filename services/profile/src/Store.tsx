// import Debug, { DebugContext } from "components/Debug";
// import {
//   Dispatch,
//   SetStateAction,
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { ConfigProvider } from "antd";
// import { MantineProvider } from "@mantine/core";
// import { User } from "__generated__/codegen";
// import jwt_decode from "jwt-decode";
// import {theme} from "@mmorg/ds-mindmatcher/dist/theme"
// import useGetUserProfile from "hooks/queries/useGetUserProfile";
// import { useSearchParams } from "react-router-dom";

// type AppContextReturnType = {
//   userId: string;
//   setUserId: Dispatch<SetStateAction<string>>;
//   jwtDecoded?: Record<string, string>;
//   setJWTDecoded?: Dispatch<SetStateAction<any>>;
//   userData?: User; // ! INTERNAL STATE userData ?? userProfileDataFromApi,
//   setUserData: Dispatch<SetStateAction<User | undefined>>;
//   refetchUserProfile: VoidFunction;
//   isProfilePending: boolean;
//   setDebuggerState: Dispatch<SetStateAction<Record<string, any> | undefined>>;
// };
// export const AppContext = createContext<AppContextReturnType>({
//   userId: "",
//   setUserId: () => {},
//   setJWTDecoded: () => {},
//   setUserData: () => {},
//   refetchUserProfile: () => {},
//   isProfilePending: false,
//   setDebuggerState: () => {},
// });

// const Store = ({ children }) => {
//   const [userData, setUserData] = useState(undefined);
//   const [userId, setUserId] = useState<string | undefined>(undefined);
//   const [jwtDecoded, setJWTDecoded] =
//     useState<Record<string, string>>(undefined);
//   const [searchParams] = useSearchParams();

//   // *****
//   // * PROFIL
//   // ********

//   const {
//     data: userProfileDataFromApi,
//     refetch: refetchUserProfile,
//     isLoading: isProfilePending,
//   } = useGetUserProfile(userId);

//   // *****
//   // * JWT
//   // ********

//   useEffect(() => {
//     if (searchParams.get("jwt")) {
//       const jwtDecoded: any = jwt_decode(searchParams.get("jwt"));
//       setJWTDecoded(jwtDecoded);
//       setUserId(jwtDecoded?.sub);
//     }
//   }, [searchParams.get("jwt"), userData]);

//   // *****
//   // * DEBUGGER
//   // ********

//   const [debuggerState, setDebuggerState] = useState({});

//   const contextValues = useMemo(() => {
//     return {
//       userId,
//       setUserId,
//       jwtDecoded,
//       setJWTDecoded,
//       userData: userProfileDataFromApi, // ! INTERNAL STATE userData ?? userProfileDataFromApi,
//       setUserData,
//       refetchUserProfile,
//       isProfilePending,
//       setDebuggerState,
//     };
//   }, [
//     userId,
//     jwtDecoded,
//     userProfileDataFromApi,
//     isProfilePending,
//     debuggerState,
//   ]);

//   const location = window.location;
//   // console.log("location", location);
//   let { hostname } = location;

//   const displayDebug =
//     window.location.hostname.includes("devonline") ||
//     window.location.hostname.includes("localhost");

//   return (
//     <AppContext.Provider value={contextValues}>
//       <ConfigProvider
//         theme={{
//           token: {
//             colorPrimary: "#F28482",
//             fontFamily: "Rubik",
//             fontSize: 16,
//           },
//         }}
//       >
//         <MantineProvider
//           theme={theme as any}
//           withNormalizeCSS
//           withGlobalStyles
//         >
//           {displayDebug && (
//             <DebugContext.Provider value={debuggerState}>
//               <Debug />
//             </DebugContext.Provider>
//           )}
//           {children}
//         </MantineProvider>
//       </ConfigProvider>
//     </AppContext.Provider>
//   );
// };

// export default Store;

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (context === undefined) {
//     throw new Error("useAppContext must be used within a Store");
//   }
//   return context;
// };
