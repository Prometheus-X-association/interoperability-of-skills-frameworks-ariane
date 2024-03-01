import config from "../../_confs/config.js";
import jwkToPem from 'jwk-to-pem';

const url = `${config.keycloak.base_url}/realms/${config.keycloak.realm}/protocol/openid-connect/certs`;
const publicKey = async () => {
  try {
    const data = await (await fetch(url)).json()
    const rsaKey = data.keys.find(
      (k) => k['kty'] === 'RSA' && k['alg'] === 'RS256',
    );
    if (rsaKey) {
      return jwkToPem(rsaKey);
    }
  } catch (e) {
    console.log('Error when parse jwk to pem for public key: ', e);
  }
}


export default (await publicKey());