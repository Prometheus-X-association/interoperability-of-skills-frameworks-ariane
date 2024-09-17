import config from "../../_confs/config.js";

export const searchUser = async ({ kcAdminClient, email }) => {
  try {
    const users = await kcAdminClient.users.find({
      email,
      exact: true,
    });

    return users[0];
  } catch (e) {
    // console.error(e)
    return null
  }
};

export const createUser = async ({ kcAdminClient, args }) => {
  const { username, email, password, ...rest } = args
  const user = await kcAdminClient.users.create({
    username: username ?? email,
    email,
    enabled: true,
    attributes: {
      ...rest
    },
    credentials: [
      {
        type: "password",
        value: password,
      },
    ],
  });

  return user;
};

export const updateUser = async ({ kcAdminClient, args }) => {
  const { id, username, email, password, ...rest } = args
  const updatedUser = await kcAdminClient.users.update(
    { id },
    {
      ...(username ? { username } : null),
      email: email,
      attributes: {
        ...rest
      },
    },
  );
  return updatedUser;
};

export const updateNewPassword = async ({ kcAdminClient, args }) => {
  const user = await kcAdminClient.users.resetPassword({
    id: args.id,
    credential: {
      temporary: false,
      type: "password",
      value: args.password,
    },
  });

  return user;
};

export const login = async ({ username, password }) => {
  const tokenQueryParams = Object.entries({
    grant_type: "password",
    client_id: config.keycloak.account.client_id,
    client_secret: config.keycloak.account.client_secret,
    username,
    password,
  }).reduce((acc, [key, value]) => {
    return `${acc}&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }, "");

  const loginRes = await fetch(
    `${config.keycloak.base_url}/realms/${config.keycloak.realm}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: tokenQueryParams,
    },
  );

  if (loginRes.status === 401) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (loginRes.status >= 400) {
    throw new Error("GENERIC_ERROR");
  }

  const accessToken = (await loginRes.json()).access_token;
  return {
    accessToken,
  };
};