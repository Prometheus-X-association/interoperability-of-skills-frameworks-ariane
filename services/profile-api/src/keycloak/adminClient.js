import KcAdminClient from "@keycloak/keycloak-admin-client";
import config from "../../_confs/config.js";
import { retry } from "../helpers/retry.js";

const kcAdminClient = new KcAdminClient({
  baseUrl: config.keycloak.base_url,
  realmName: config.keycloak.realm,
});

const auth = async () => {
  await kcAdminClient.auth({
    username: config.keycloak.admin.username,
    password: config.keycloak.admin.password,
    grantType: "client_credentials",
    clientId: config.keycloak.admin.client_id,
    clientSecret: config.keycloak.admin.client_secret,
  });
};

await retry(auth, { retryTimes: 3, delay: 30000 });
setInterval(
  async () => {
    await retry(auth, { retryTimes: 3, delay: 30000 });
    // console.log("accessToken", await kcAdminClient.getAccessToken());
  },
  1000 * 60 * 5,
);

// console.log('after authed', (await kcAdminClient.users.find()).forEach((user) => {
//   console.log('user', JSON.stringify(user.attributes))
// }))
// const users = await kcAdminClient.users.find()
// console.log('users', users)

// console.log('user 3898c4aa-a0ad-4252-a112-7c2259648b0f', await kcAdminClient.users.listRealmRoleMappings({
//   id: '3898c4aa-a0ad-4252-a112-7c2259648b0f'
// }))

// await kcAdminClient.users.create({
//   id: '123123',
//   username: 'test',
//   email: 'test@gmail.com',
//   enabled: true,
//   attributes: {
//     value1: 'value1',
//     value2: true
//   },
//   credentials: [{
//     type: 'password',
//     value: 'test',
//   }]
// })
//
// const user = await kcAdminClient.users.find({
//   username: 'test1',
//   exact: true
// })
// console.log('user', user)

export default kcAdminClient;
