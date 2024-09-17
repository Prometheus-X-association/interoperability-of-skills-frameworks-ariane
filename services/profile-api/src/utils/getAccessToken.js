// @ts-ignore
import config from "../../_confs/config.js";


// node services/profile-api/src/utils/getAccessToken.js

const tokenQueryParams = Object.entries({
  grant_type: "password",
  client_id: config.keycloak.account.client_id,
  client_secret: config.keycloak.account.client_secret,
  username: 'test',
  password: 'test',
}).reduce((acc, [key, value]) => {
  return `${acc}&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}, '')
const token = (await (await fetch(`${config.keycloak.base_url}/realms/${config.keycloak.realm}/protocol/openid-connect/token`, {
  method: "POST",
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  body: tokenQueryParams
})).json())

console.log('Header key & value to use:')
console.log('Authorization')
console.log(`Bearer ${token.access_token}`)
console.log()

console.log(`For graphql-sandbox : add it in the "Shared headers" section of "Connexion settings" configuration. 
This configuration can be found under the logo between the url and the publish button (top left)`)


// console.log('token', token)