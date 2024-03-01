import { GraphQLError } from 'graphql';
import { login } from '../helpers/keycloak.js';
import kcAdminClient from '../keycloak/adminClient.js';

export default async (_, args, context, info) => {
  try {
    return login({
      username: args.username,
      password: args.password
    })
  } catch (e) {
    throw new GraphQLError(e.message)
  }
}

