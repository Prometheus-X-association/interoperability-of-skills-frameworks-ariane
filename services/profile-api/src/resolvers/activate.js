import { validateOneTimeToken } from '../keycloak/oneTimeToken.js';

export default async (_, args, context, info) => {
  try {
    const { token } = args
    const validateToken = validateOneTimeToken(token)
    const { sub } = validateToken
    const user = await context.dataLoader.getByArgs({
      size: 1,
      filters: {
        type: "mms:User",
        id: sub,
      },
    }, null)

    if (!user?.[0]?.status?.[0]) {
      throw new Error('Invalid activation token')
    }
    const statusObject = user[0].status[0]
    const status = statusObject['@value'] ?? statusObject.value

    if (status === 'Active') {
      throw new Error('User already activated')
    }

    if (status !== 'Pending') {
      throw new Error('Account cannot be activated')
    }

    const mutations = info.schema.getMutationType().getFields();
    await mutations.updateUser?.resolve?.(
      undefined,
      {
        input: {
          data: {
            id: sub,
            status: [{ value: 'Active' }],
          },
          where: {
            id: [sub]
          }
        }
      },
      context,
      info
    )

    return {
      userId: sub
    }
  } catch (e) {
    throw new Error(e.responseData?.errorMessage ?? e)
  }
}