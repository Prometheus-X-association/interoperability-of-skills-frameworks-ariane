import { Client } from "@elastic/elasticsearch";
import config from "./_confs/config.js";
import { Client as EngineClient } from "@elastic/enterprise-search";

const client = new Client({
  node: config.elastic.indexUrl,

  auth: {
    apiKey: config.elastic.indexApiKey,
  },
});

console.log("client", await client.info());
const engineClient = new EngineClient({
  url: config.elastic.url,
  auth: {
    token: config.elastic.apiKey,
  },
}).app;
// const res = await engineClient.createEngine({
//   name: "employments",
// });
// console.log("res");
// await client.indices.create({
//   index: "search-5-min-profile-1",
//   mappings: {
//     dynamic_templates: [
//       {
//         geolocation: {
//           match_pattern: "regex",
//           match: "geolocation|(location__geolocation__.*)",
//           mapping: {
//             type: "geo_point",
//           },
//         },
//       },
//       {
//         employment_zone: {
//           match: "employment_zone",
//           mapping: {
//             type: "geo_shape",
//           },
//         },
//       },
//       {
//         vector: {
//           match_pattern: "regex",
//           match: "experience__occupation__vector__.*",
//           mapping: {
//             type: "dense_vector",
//             dims: 1024,
//             index: true,
//             similarity: "cosine",
//           },
//         },
//       },
//     ],
//     properties: {
//       impression: {
//         type: "text",
//         fields: {
//           keyword: {
//             type: "keyword",
//           },
//         },
//       },
//     },
//   },
// });
// await client.indices.create({
//   index: "search-5-min-mission-3",
//   mappings: {
//     dynamic_templates: [
//       {
//         geolocation: {
//           match_pattern: "regex",
//           match: "geolocation|(address__geolocation__.*)",
//           mapping: {
//             type: "geo_point",
//           },
//         },
//       },
//       {
//         vector: {
//           match_pattern: "regex",
//           match: "vector",
//           mapping: {
//             type: "dense_vector",
//             dims: 1024,
//             index: true,
//             similarity: "cosine",
//           },
//         },
//       },
//     ],
//   },
// });
// await client.reindex({
//   source: {
//     index: "search-5-min-profile-1-2",
//   },
//   dest: {
//     index: "search-5-min-profile-1",
//   },
// });
// const job = await client.search({
//   index: "search-5-min-profile-1",
//   query: { ids: { values: ["mirrored/23a6d69c-e326-40b1-a1dd-8e634efe6f53"] } },
//   size: 2,
// });
// console.log(
//   "job",
//   JSON.stringify(
//     job.hits?.hits.map((h) => h._source),
//     null,
//     2
//   )
// );

// try {
//   await client.indices.putMapping({
//     index: "search-5-min-profile-1-2",
//     properties: {
//       impression: {
//         type: "text",
//         fields: {
//           keyword: {
//             type: "keyword",
//           },
//         },
//       },
//     },
//   });
// } catch (e) {
//   console.error(e);
// }
