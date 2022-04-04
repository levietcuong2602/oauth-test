const moment = require("moment");
const camelcaseKeys = require("camelcase-keys");

const { generateToken } = require("../utilities/auth");
const { omitIsNil } = require("../utilities/omit");
const { encryptPassword, generateSalt } = require("../utilities/bcrypt");

const {
  SECRET_REFRESH,
  SECRET_TOKEN,
  REFRESH_TOKEN_LIFETIME,
  TOKEN_LIFETIME,
} = require("../config");
const { TOKEN_TYPE } = require("../constants");

const userDao = require("../daos/user");
const clientDao = require("../daos/client");
const userRoleDao = require("../daos/userRole");
const roleDao = require("../daos/role");
const tokenDao = require("../daos/token");

const userRoleService = require("../services/userRole");

const generateAndSaveToken = async ({
  tokenData,
  secretKey,
  options,
  type,
  referenceId,
  tokenExpiresAt,
}) => {
  // generate token by jwt
  const token = await generateToken(tokenData, secretKey, options);

  // save token to db
  const {
    user: { id: userId },
    client: { id: clientId },
  } = tokenData;
  const data = await tokenDao.saveToken(
    omitIsNil(
      {
        token,
        type,
        userId,
        clientId,
        tokenExpiresAt,
        referenceId,
      },
      { deep: true }
    )
  );

  return data;
};

const registerAccount = async ({ username, password, client_id }) => {
  // check username exists
  const user = await userDao.findUser({ username });
  if (user) throw new Error("User already exists with same username");

  // check client
  const client = await clientDao.findClient({ client_id });
  if (!client) throw new Error("Client not exists");

  const salt = generateSalt(10);
  const newUser = await userDao.createUser({
    password: await encryptPassword(password, salt),
    username,
    salt,
  });

  // add role basic user in client: user, modifier, admin
  const roleDefault = await roleDao.findRole({ isDefault: true });
  if (roleDefault) {
    await userRoleDao.createUserRole({
      userId: newUser.id,
      clientId: client.id,
      roleId: roleDefault.id,
    });
  }
  // return list role in all clients
  let roles = await userRoleService.getRoleUserInClients(newUser.id);

  // generate refresh token and save token
  const tokenData = {
    user: {
      id: newUser.id,
      username: newUser.username,
      walletAddress: newUser.wallet_address,
    },
    client: {
      id: client.id,
      clientId: client.client_id,
      clientRedirectUris: client.rediect_uris,
      grants: client.grants,
    },
    roles,
  };
  const refresh = await generateAndSaveToken({
    tokenData,
    options: {
      expiresIn: REFRESH_TOKEN_LIFETIME,
      algorithm: "HS256",
    },
    secretKey: SECRET_REFRESH,
    tokenExpiresAt: moment().add(REFRESH_TOKEN_LIFETIME, "seconds").toDate(),
    type: TOKEN_TYPE.REFRESH_TOKEN,
  });

  // generate access token and save token
  const token = await generateAndSaveToken({
    tokenData,
    options: {
      expiresIn: TOKEN_LIFETIME,
      algorithm: "HS256",
    },
    referenceId: refresh.id,
    secretKey: SECRET_TOKEN,
    tokenExpiresAt: moment().add(TOKEN_LIFETIME, "seconds").toDate(),
    type: TOKEN_TYPE.ACCESS_TOKEN,
  });

  return {
    user: {
      id: newUser.id,
      username: newUser.username,
      walletAddress: newUser.wallet_address,
    },
    roles,
    accessToken: token.token,
    tokenExpiresAt: token.token_expires_at,
    refreshToken: refresh.token,
    refreshTokenExpiresAt: refresh.token_expires_at,
    tokenType: "Bearer",
  };
};

module.exports = { generateAndSaveToken, registerAccount };
