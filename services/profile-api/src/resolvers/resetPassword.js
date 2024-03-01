import { login, searchUser, updateNewPassword } from '../helpers/keycloak.js';
import kcAdminClient from '../keycloak/adminClient.js';

export default async (_, args, context, info) => {
  if (!context.isAdminSite && (!context.authObject?.sub || !context.authObject?.preferred_username)) {
    // TODO: temporary only, later will use
    throw new Error("You are not allowed to access this resource")
  }
  let accessToken;
  if (context.authObject?.sub) {
    const userId = context.authObject.sub
    const { password } = args

    await updateNewPassword({
      kcAdminClient,
      args: {
        id: userId,
        password
      }
    })

    const tokenObject = await login({
      username: context.authObject.preferred_username,
      password
    })

    accessToken = tokenObject.accessToken
  } else if (context.isAdminSite) {
    const { email, password } = args
    const user = await searchUser({ kcAdminClient, email });
    if (!user) {
      throw new Error('User not found')
    }
    await updateNewPassword({
      kcAdminClient,
      args: {
        id: user.id,
        password
      }
    })

    const tokenObject = await login({
      username: user.username,
      password
    })

    accessToken = tokenObject.accessToken
  }

  return {
    accessToken
  }
}