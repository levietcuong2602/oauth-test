/* eslint-disable camelcase */
const moment = require('moment');

const { generateToken } = require('../utilities/auth');
const { omitIsNil } = require('../utilities/omit');
const { encryptPassword, generateSalt } = require('../utilities/bcrypt');
const { generateSecurityKey } = require('../utilities/security');
const { verifyMessage } = require('../utilities/ethers');

const {
  SECRET_REFRESH,
  SECRET_TOKEN,
  REFRESH_TOKEN_LIFETIME,
  TOKEN_LIFETIME,
  SESSION_LIFETIME,
} = require('../config');
const { TOKEN_TYPE, AUTHORIZATION_CODE_LIFETIME } = require('../constants');
const { sequelize } = require('../models');

const userDao = require('../daos/user');
const clientDao = require('../daos/client');
const userRoleDao = require('../daos/userRole');
const roleDao = require('../daos/role');
const tokenDao = require('../daos/token');
const sessionDao = require('../daos/session');
const authorizationCodeDao = require('../daos/authorizationCode');

const userRoleService = require('./userRole');
const CustomError = require('../errors/CustomError');
const statusCode = require('../errors/code');

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
      { deep: true },
    ),
  );

  return data;
};

const registerAccount = async ({ username, password, clientId }) => {
  // check username exists
  const user = await userDao.findUser({ username });
  if (user)
    throw new CustomError(
      statusCode.BAD_REQUEST,
      'User already exists with same username',
    );

  // check client
  const client = await clientDao.findClient({ clientId });
  if (!client) throw new CustomError(statusCode.NOT_FOUND, 'Client not exists');

  const salt = generateSalt(10);
  const newUser = await userDao.createUser({
    password: await encryptPassword(password, salt),
    username,
    salt,
  });

  // add role default user in client: user, modifier, admin
  const roleDefault = await roleDao.findRole({ isDefault: true });
  if (roleDefault) {
    await userRoleDao.createUserRole({
      userId: newUser.id,
      clientId: client.id,
      roleId: roleDefault.id,
    });
  }
  // return list role in all clients
  const roles = await userRoleService.getRoleUserInClients(newUser.id);

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
    roles: roles.map((item) => ({
      roleId: item.roleId,
      clientId: item.client.clientId,
      roleName: item.role.name,
    })),
  };
  // generate refresh token and save token
  const refresh = await generateAndSaveToken({
    tokenData,
    options: {
      expiresIn: REFRESH_TOKEN_LIFETIME,
      algorithm: 'HS256',
    },
    secretKey: SECRET_REFRESH,
    tokenExpiresAt: moment().add(REFRESH_TOKEN_LIFETIME, 'seconds').toDate(),
    type: TOKEN_TYPE.REFRESH_TOKEN,
  });

  // generate access token and save token
  const token = await generateAndSaveToken({
    tokenData,
    options: {
      expiresIn: TOKEN_LIFETIME,
      algorithm: 'HS256',
    },
    referenceId: refresh.id,
    secretKey: SECRET_TOKEN,
    tokenExpiresAt: moment().add(TOKEN_LIFETIME, 'seconds').toDate(),
    type: TOKEN_TYPE.ACCESS_TOKEN,
  });

  return {
    accessToken: token.token,
    tokenExpiresAt: token.token_expires_at,
    refreshToken: refresh.token,
    refreshTokenExpiresAt: refresh.token_expires_at,
    tokenType: 'Bearer',
  };
};

const getAuthorizationTokenByMobile = async ({ userId, clientId }) => {
  // generate authorization token
  const authorizationCode = generateSecurityKey();
  // save authorization token
  const codeData = {
    authorizationCode,
    userId,
    clientId,
    expiresAt: moment().add(AUTHORIZATION_CODE_LIFETIME, 'seconds').toDate(),
  };
  const code = await authorizationCodeDao.createAuthorizationCode(codeData);
  // return code
  return { code: authorizationCode, expiresAt: code.expires_at };
};

const generateNonceSession = async ({ walletAddress, clientId }) => {
  const client = await clientDao.findClient({ clientId });
  if (!client) throw new CustomError(statusCode.NOT_FOUND, 'Client not exists');

  const sessionData = {
    nonce: generateSecurityKey(),
    expiresAt: moment().add(SESSION_LIFETIME, 'seconds').toDate(),
    clientId: client.id,
    walletAddress,
  };
  const session = await sessionDao.createSession(sessionData);
  return session;
};

const verifySignature = async ({
  walletAddress,
  clientId,
  sessionId,
  signature,
}) => {
  // check client id
  const client = await clientDao.findClient({ clientId });
  if (!client) throw new CustomError(statusCode.NOT_FOUND, 'Client not found');

  // check session id
  const session = await sessionDao.findSession({
    id: sessionId,
  });
  if (!session)
    throw new CustomError(statusCode.NOT_FOUND, 'Session not found');
  if (new Date(session.expires_at).valueOf() < new Date().valueOf())
    throw new CustomError(statusCode.BAD_REQUEST, 'Session is expired');

  if (
    session.client_id - client.id !== 0 ||
    session.wallet_address !== walletAddress
  )
    throw new CustomError(statusCode.BAD_REQUEST, 'Session is invalid');

  // verify signature
  const isVerifyValid = await verifyMessage({
    message: session.nonce,
    signature,
    address: walletAddress,
  });
  if (!isVerifyValid)
    throw new CustomError(statusCode.UNAUTHORIZED, 'Invalid signature');

  // remove session
  await sessionDao.deleteSession(sessionId);

  // check wallet address, if not exist create
  let user = await userDao.findUser({ walletAddress });
  if (!user) {
    user = await userDao.createUser({ walletAddress });

    const roleDefault = await roleDao.findRole({ isDefault: true });
    if (roleDefault) {
      await userRoleDao.createUserRole({
        userId: user.id,
        clientId: client.id,
        roleId: roleDefault.id,
      });
    }
  }

  // return list role in all clients
  const roles = await userRoleService.getRoleUserInClients(user.id);

  const tokenData = {
    user: {
      id: user.id,
      username: user.username,
      walletAddress: user.wallet_address,
    },
    client: {
      id: client.id,
      clientId: client.client_id,
      clientRedirectUris: client.rediect_uris,
      grants: client.grants,
    },
    roles: roles.map((item) => ({
      roleId: item.roleId,
      clientId: item.client.clientId,
      roleName: item.role.name,
    })),
  };
  // generate refresh token and save token
  const refresh = await generateAndSaveToken({
    tokenData,
    options: {
      expiresIn: REFRESH_TOKEN_LIFETIME,
      algorithm: 'HS256',
    },
    secretKey: SECRET_REFRESH,
    tokenExpiresAt: moment().add(REFRESH_TOKEN_LIFETIME, 'seconds').toDate(),
    type: TOKEN_TYPE.REFRESH_TOKEN,
  });

  // generate access token and save token
  const token = await generateAndSaveToken({
    tokenData,
    options: {
      expiresIn: TOKEN_LIFETIME,
      algorithm: 'HS256',
    },
    referenceId: refresh.id,
    secretKey: SECRET_TOKEN,
    tokenExpiresAt: moment().add(TOKEN_LIFETIME, 'seconds').toDate(),
    type: TOKEN_TYPE.ACCESS_TOKEN,
  });

  return {
    accessToken: token.token,
    tokenExpiresAt: token.token_expires_at,
    refreshToken: refresh.token,
    refreshTokenExpiresAt: refresh.token_expires_at,
    tokenType: 'Bearer',
  };
};

const combineAccountAndWallet = async ({ accountId, walletId, clientId }) => {
  // check client id
  const client = await clientDao.findClient({ clientId });
  if (!client) throw new CustomError(statusCode.NOT_FOUND, 'Client not found');

  let transaction;
  let account = await userDao.findUser({ id: accountId });
  if (!account)
    throw new CustomError(statusCode.NOT_FOUND, 'the account not found');

  if (account.wallet_address)
    throw new CustomError(
      statusCode.BAD_REQUEST,
      'The account has been linked to the wallet',
    );

  const wallet = await userDao.findUser({ id: walletId });
  if (!wallet)
    throw new CustomError(statusCode.NOT_FOUND, 'the wallet not found');
  if (!wallet.wallet_address)
    throw new CustomError(
      statusCode.BAD_REQUEST,
      'the wallet address is invalid',
    );

  try {
    transaction = await sequelize.transaction();

    // combine role
    const rolesOfWallet = await userRoleService.getRoleUserInClients(wallet.id);
    await Promise.all(
      rolesOfWallet.map(async (item) => {
        const accountHasRoleInClient = await userRoleDao.findUserRole({
          userId: account.id,
          clientId: item.clientId,
        });
        if (!accountHasRoleInClient)
          await userRoleDao.createUserRole({
            userId: account.id,
            roleId: item.roleId,
            clientId: item.clientId,
          });

        await userRoleDao.deleteUserRole({
          userId: item.userId,
          clientId: item.clientId,
        });
      }),
    );
    // delete account
    await userDao.deleteUser({
      id: wallet.id,
    });

    // combine info
    account = await userDao.updateUser(account.id, {
      walletAddress: wallet.wallet_address,
    });
    await transaction.commit();
    // return info account combine
    const roles = await userRoleService.getRoleUserInClients(account.id);

    const tokenData = {
      user: {
        id: account.id,
        username: account.username,
        walletAddress: account.wallet_address,
      },
      client: {
        id: client.id,
        clientId: client.client_id,
        clientRedirectUris: client.rediect_uris,
        grants: client.grants,
      },
      roles: roles.map((item) => ({
        roleId: item.roleId,
        clientId: item.client.clientId,
        roleName: item.role.name,
      })),
    };
    // generate refresh token and save token
    const refresh = await generateAndSaveToken({
      tokenData,
      options: {
        expiresIn: REFRESH_TOKEN_LIFETIME,
        algorithm: 'HS256',
      },
      secretKey: SECRET_REFRESH,
      tokenExpiresAt: moment().add(REFRESH_TOKEN_LIFETIME, 'seconds').toDate(),
      type: TOKEN_TYPE.REFRESH_TOKEN,
    });

    // generate access token and save token
    const token = await generateAndSaveToken({
      tokenData,
      options: {
        expiresIn: TOKEN_LIFETIME,
        algorithm: 'HS256',
      },
      referenceId: refresh.id,
      secretKey: SECRET_TOKEN,
      tokenExpiresAt: moment().add(TOKEN_LIFETIME, 'seconds').toDate(),
      type: TOKEN_TYPE.ACCESS_TOKEN,
    });

    return {
      accessToken: token.token,
      tokenExpiresAt: token.token_expires_at,
      refreshToken: refresh.token,
      refreshTokenExpiresAt: refresh.token_expires_at,
      tokenType: 'Bearer',
    };
  } catch (err) {
    if (transaction) await transaction.rollback();

    throw new CustomError(statusCode.INTERNAL_SERVER_ERROR, err.message);
  }
};

module.exports = {
  generateAndSaveToken,
  registerAccount,
  getAuthorizationTokenByMobile,
  generateNonceSession,
  verifySignature,
  combineAccountAndWallet,
};
