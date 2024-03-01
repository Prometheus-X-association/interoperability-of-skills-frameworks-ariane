import { Client } from "@elastic/elasticsearch";
import request from "graphql-request";
import config from "../../_confs/config.js";
import kcAdminClient from "./adminClient.js";

const indexClient = new Client({
  node: config.elastic.indexUrl,

  auth: {
    apiKey: config.elastic.indexApiKey,
  },
});
/**
 * Find all keycloak users
 */
const users = (await kcAdminClient.users.find({})).map((kcUser) => ({
  id: kcUser.id,
  username: kcUser.username,
  email: kcUser.email,
  first_name: kcUser.attributes?.first_name?.[0],
  last_name: kcUser.attributes?.last_name?.[0],
}));

// console.log('users', users)

/**
 * Util to request to graphql
 */
async function requestWrapper(operationName, url, query, variables) {
  let errors;
  let _req;
  let value;
  try {
    const response = await request(url, query, variables);
    value = response[operationName];
  } catch (e) {
    if (!e?.response?.errors) {
      console.log("Another kind of Error:\n", e);
    }
    // console.log(e)
    errors = e.response.errors;
    _req = e.request;
    console.log("There is error during the query !");
  }

  return {
    value,
    errors,
    request: _req,
  };
}

/**
 * Update users in engine to add keycloak id
 */
// const updatedUserRes = await requestWrapper(
//   "User",
//   "http://localhost:5020/graphql",
//   `
//     mutation Mutation($input: updateUserInput) {
//       updateUser(input: $input) {
//         id
//         keycloakId {
//           value
//         }
//       }
//     }
//   `,
//   {
//     input: {
//       bulk: users.map((u) => ({
//         id: u.id,
//         keycloakId: [{ value: u.id }],
//       })),
//       where: {
//         id: users.map((u) => u.id),
//       },
//     },
//   },
// );
//
// console.log("updatedUserRes", updatedUserRes);

/**
 * Find wrong profile with bad experiences
 */
// const currentWrongProfile = (
//   await indexClient.search({
//     index: "search-5-min-profile-1",
//     query: {
//       bool: {
//         must: [
//           // {
//           //   exists: { field: "lastUpdatedAt" },
//           // },
//           // {
//           //   exists: { field: "preferred_distance__value" },
//           // },
//           // {
//           //   exists: { field: "experience__id__0" },
//           // },
//           // {
//           //   exists: { field: "experience__occupation__vector__0" },
//           // },
//           // {
//           //   exists: { field: "email__value" },
//           // },
//           {
//             term: {
//               "type.keyword": {
//                 value: "mms:User",
//               },
//             },
//           },
//         ],
//         // must_not: [
//         //   {
//         //     exists: { field: "experience__duration__0" },
//         //   },
//         // ],
//       },
//     },
//     size: 200,
//   })
// ).hits.hits;
// console.log("currentWrongProfile", currentWrongProfile);

/**
 * Find all personal wallets associated with above keycloak users' ids and fix bad data
 */
const personalDataWallets = await requestWrapper(
  "PersonalDataWallet",
  "http://localhost:5020/graphql",
  `
    query Query($where: JSON, $pagination: paginationInput) {
      PersonalDataWallet(where: $where, pagination: $pagination) {
        id
      }
    }
  `,
  {
    // where: {
    //   personalDataOf: currentWrongProfile.map(
    //     (u) => u._source.searched_user_of[0]
    //   ),
    // },
    pagination: {
      page: 1,
      limit: 1000,
    },
  }
);
console.log(
  "personalDataWallets",
  JSON.stringify(personalDataWallets.value, null, 2)
);
// const addresses = await requestWrapper(
//   "Address",
//   "http://localhost:5020/graphql",
//   `
//     query Query($where: JSON, $pagination: paginationInput) {
//       Address(where: $where, pagination: $pagination) {
//         id
//         geolocation {
//           value
//         }
//       }
//     }
//   `,
//   {
//     id: personalDataWallets.value?.map((v) => v.location ?? []).flat() ?? [],
//     pagination: {
//       page: 1,
//       limit: 1000,
//     },
//   },
// );
// console.log("addresses", addresses.value);

// console.log("personalDataWallets", personalDataWallets.value);

// const usersWithPersonalDataWallets = users.filter(u => personalDataWallets.value.find(pdw => pdw.personalDataOf?.[0]?.id === u.id))
// console.log('usersWithPersonalDataWallets:', usersWithPersonalDataWallets)

/**
 * Update personal data wallet with keycloak detail
 */
// const updatedPDW = personalDataWallets.value
//   .map(pdw => {
//     const associatedUser = users.find(u => pdw.personalDataOf?.[0]?.id === u.id)
//     if (!associatedUser) return null;
//
//     return ({
//       id: pdw.id,
//       details: {
//         ...(associatedUser.email ? ({email: [{ value: associatedUser.email }]}) : null),
//         ...(associatedUser.last_name ? ({family: [{ value: associatedUser.last_name }]}) : null),
//         ...(associatedUser.first_name ? ({given: [{ value: associatedUser.first_name }]}) : null),
//       }
//     })
//   })
//   .filter(Boolean)
//
// console.log('updatedPDW', JSON.stringify(updatedPDW, null, 2))
// const updatedPDWRes = await requestWrapper(
//   "PersonalDataWallet",
//   "http://localhost:5020/graphql",
//   `
//     mutation Mutation($input: updatePersonalDataWalletInput) {
//       updatePersonalDataWallet(input: $input) {
//         id
//       }
//     }
//   `,
//   {
//     input: {
//       bulk: personalDataWallets.value.map((v) => ({ id: v.id })),
//       where: {
//         id: personalDataWallets.value.map((pdw) => pdw.id),
//       },
//     },
//   },
// );
//
// console.log("updatedPDWRes", updatedPDWRes.value);

// const experienceIds = currentWrongProfile
//   .map((profile) => {
//     return Object.entries(profile._source ?? {})
//       .filter(([key]) => key.startsWith("experience__id__"))
//       .map(([_, value]) => value);
//   })
//   .flat();
// console.log("experienceIds", [...new Set(experienceIds)]);
// const experienceDetails = (
//   await indexClient.search({
//     index: ".ent-search-engine-documents-5-min-profile-1",
//     query: { ids: { values: [...new Set(experienceIds)] } },
//     size: experienceIds.length,
//   })
// ).hits.hits;
// console.log("experienceDetails", experienceDetails.length);
//
// const experienceWithTitle = experienceDetails.filter(
//   (e) => !!e._source?.title__value,
// );
// console.log(
//   "experienceWithTitle",
//   experienceWithTitle.map((e) => e._source.title__value),
// );

/**
 * find associated occupation based on name of experiences with bad data
 */
// const occupations = (
//   await indexClient.search({
//     index: ".ent-search-engine-documents-jobs-skills-fr-rome4-3",
//     query: {
//       terms: {
//         "pref_label__value.enum": experienceWithTitle.map(
//           (e) => e._source.title__value,
//         ),
//       },
//     },
//     size: experienceWithTitle.length,
//   })
// ).hits.hits;
//
// console.log(
//   "occupations",
//   occupations.map((o) => o._source.pref_label__value),
// );
//
// const experienceToOccupation = experienceWithTitle
//   .map((e) => {
//     const title = e._source?.title__value;
//     const associatedOccupation = occupations.find(
//       (o) => o._source?.pref_label__value?.[0] === title,
//     );
//     if (associatedOccupation) {
//       return {
//         id: e._id,
//         occupation: [associatedOccupation._id],
//       };
//     }
//     return null;
//   })
//   .filter(Boolean);
//
// console.log("experienceToOccupation", experienceToOccupation);

/**
 * Update experiences with associated occupation
 */
// const updatedExperienceRes = await requestWrapper(
//   "Experience",
//   "http://localhost:5020/graphql",
//   `
//     mutation Mutation($input: updateExperienceInput) {
//       updateExperience(input: $input) {
//         id
//         occupation {
//           ... on Job {
//             id
//           }
//           ... on Position {
//             id
//           }
//         }
//       }
//     }
//   `,
//   {
//     input: {
//       bulk: experienceToOccupation,
//       where: {
//         id: experienceToOccupation.map((u) => u.id),
//       },
//     },
//   },
// );
// console.log("updatedExperienceRes", updatedExperienceRes);
/**
 * Run update on user to auto mirror experience data in user's mirrored document
 */
// const updatedUserRes = await requestWrapper(
//   "User",
//   "http://localhost:5020/graphql",
//   `
//     mutation Mutation($input: updateUserInput) {
//       updateUser(input: $input) {
//         id
//       }
//     }
//   `,
//   {
//     input: {
//       bulk: currentWrongProfile.map((u) => ({
//         id: u._id.replace("mirrored/", ""),
//         searchedUser: [u._id],
//       })),
//       where: {
//         id: currentWrongProfile.map((u) => u._id.replace("mirrored/", "")),
//       },
//     },
//   }
// );
//
// console.log("updatedUserRes", updatedUserRes);
