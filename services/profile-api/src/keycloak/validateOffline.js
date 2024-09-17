import jwt from 'jsonwebtoken';
import publicKey from './publicKey.js';
export const validateOffline = (token) => {
  try {
    if (!publicKey) {
      throw new Error('There is no jwt publicKey provided')
    }
    const authObject = jwt.verify(token, publicKey)

    if (authObject) {
      return authObject
    }
  } catch (e) {
    // console.log('e', e)
  }
  throw new Error('The token is not valid')
}