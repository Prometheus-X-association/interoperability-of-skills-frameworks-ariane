import config from '../../_confs/config.js';
import jwt from 'jsonwebtoken';

export const generateOneTimeToken = (userId, expiresIn = '3d') => {
  return jwt.sign({
    sub: userId,
    iat: Date.now()
  }, config.keycloak.account.client_secret, { expiresIn })
}

export const validateOneTimeToken = (token) => {
  try {
    const authObject = jwt.verify(token, config.keycloak.account.client_secret)

    if (authObject) {
      return authObject
    }
  } catch (e) {
    throw new Error('The token is not valid')
  }
}