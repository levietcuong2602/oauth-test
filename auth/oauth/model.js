// See https://oauth2-server.readthedocs.io/en/latest/model/spec.html for what you can do with this
const crypto = require("crypto");
const camelcaseKeys = require("camelcase-keys");

const clientDao = require("../daos/client");
const authorizationCodeDao = require("../daos/authorizationCode");
const tokenDao = require("../daos/token");

const { generateToken } = require("../utilities/auth");
const { TOKEN_TYPE } = require("../constants");

const {
  SECRET_REFRESH,
  SECRET_TOKEN,
  REFRESH_TOKEN_LIFETIME,
  TOKEN_LIFETIME,
} = require("../config");

const db = {
  // Here is a fast overview of what your db model should look like
  authorizationCode: {
    authorizationCode: "", // A string that contains the code
    expiresAt: new Date(), // A date when the code expires
    redirectUri: "", // A string of where to redirect to with this code
    client: null, // See the client section
    user: null, // Whatever you want... This is where you can be flexible with the protocol
  },
  client: {
    // Application wanting to authenticate with this server
    clientId: "", // Unique string representing the client
    clientSecret: "", // Secret of the client; Can be null
    grants: [], // Array of grants that the client can use (ie, `authorization_code`)
    redirectUris: [], // Array of urls the client is allowed to redirect to
  },
  token: {
    accessToken: "", // Access token that the server created
    accessTokenExpiresAt: new Date(), // Date the token expires
    client: null, // Client associated with this token
    user: null, // User associated with this token
  },
};

const DebugControl = require("../utilities/debug.js");
const { Sequelize } = require("../models");

module.exports = {
  getClient: async function (clientId, clientSecret) {
    // query db for details with client
    let client = await clientDao.findClient({ clientId });
    if (!client) throw new Error("client not found");

    log({
      title: "Get Client",
      parameters: [
        { name: "clientId", value: clientId },
        { name: "clientSecret", value: client.client_secret },
      ],
    });
    // db.client = {
    //   clientId: clientId,
    //   clientSecret: clientSecret,
    //   grants: ["authorization_code", "refresh_token"],
    //   redirectUris: ["http://localhost:3030/client/app"],
    // };
    // Retrieved from the database
    return new Promise(async (resolve) => {
      client = camelcaseKeys(
        {
          ...client,
          grants: client.grants ? JSON.parse(client.grants) : [],
          redirectUris: client.redirect_uris
            ? JSON.parse(client.redirect_uris)
            : [],
        },
        { deep: true }
      );

      resolve(client);
    });
  },
  generateAccessToken: async (client, user, scope) => {
    // generates access tokens
    log({
      title: "Generate Access Token",
      parameters: [
        { name: "client", value: client },
        { name: "user", value: user },
      ],
    });
    const token = await generateToken({ client, user }, SECRET_TOKEN, {
      expiresIn: TOKEN_LIFETIME,
      algorithm: "HS256",
    });
    return token;
  },
  saveToken: async (token, client, user) => {
    /* This is where you insert the token into the database */
    log({
      title: "Save Token",
      parameters: [
        { name: "token", value: token },
        { name: "client", value: client },
        { name: "user", value: user },
      ],
    });

    const {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = token;
    // save refresh token
    const refreshTokenRecord = await tokenDao.saveToken({
      token: accessToken,
      tokenExpiresAt: accessTokenExpiresAt,
      type: TOKEN_TYPE.REFRESH_TOKEN,
      clientId: client.id,
      userId: user.id,
    });
    // save token
    const accessTokenRecord = await tokenDao.saveToken({
      token: accessToken,
      tokenExpiresAt: refreshTokenExpiresAt,
      type: TOKEN_TYPE.ACCESS_TOKEN,
      referenceId: refreshTokenRecord.id,
      clientId: client.id,
      userId: user.id,
    });
    const tokenData = {
      accessToken,
      accessTokenExpiresAt: accessTokenRecord.token_expires_at,
      refreshToken, // NOTE this is only needed if you need refresh tokens down the line
      refreshTokenExpiresAt: refreshTokenRecord.token_expires_at,
      client: client,
      user: user,
    };

    return tokenData;
  },
  getAccessToken: async (token) => {
    /* This is where you select the token from the database where the code matches */
    log({
      title: "Get Access Token",
      parameters: [{ name: "token", value: token }],
    });
    if (!token || token === "undefined") return false;

    let accessTokenRecord = await tokenDao.findToken({
      token,
      type: TOKEN_TYPE.ACCESS_TOKEN,
    });
    if (!accessTokenRecord) return false;

    accessTokenRecord = camelcaseKeys(accessTokenRecord, { deep: true });
    const tokenData = {
      accessToken: accessTokenRecord.token, // Access token that the server created
      accessTokenExpiresAt: accessTokenRecord.tokenExpiresAt, // Date the token expires
      user: accessTokenRecord.user,
      client: accessTokenRecord.client,
    };

    return new Promise((resolve) => resolve(tokenData));
  },
  generateRefreshToken: async (client, user, scope) => {
    // generates access tokens
    log({
      title: "Generate Refresh Token",
      parameters: [
        { name: "client", value: client },
        { name: "user", value: user },
      ],
    });
    const token = await generateToken({ client, user }, SECRET_REFRESH, {
      expiresIn: REFRESH_TOKEN_LIFETIME,
      algorithm: "HS256",
    });
    return token;
  },
  getRefreshToken: (token) => {
    /* Retrieves the token from the database */
    log({
      title: "Get Refresh Token",
      parameters: [{ name: "token", value: token }],
    });
    DebugControl.log.variable({ name: "db.token", value: db.token });
    return new Promise((resolve) => resolve(db.token));
  },
  revokeToken: (token) => {
    /* Delete the token from the database */
    log({
      title: "Revoke Token",
      parameters: [{ name: "token", value: token }],
    });
    if (!token || token === "undefined") return false;
    return new Promise((resolve) => resolve(true));
  },
  generateAuthorizationCode: (client, user, scope) => {
    /* 
    For this to work, you are going have to hack this a little bit:
    1. navigate to the node_modules folder
    2. find the oauth_server folder. (node_modules/express-oauth-server/node_modules/oauth2-server)
    3. open lib/handlers/authorize-handler.js
    4. Make the following change (around line 136):

    AuthorizeHandler.prototype.generateAuthorizationCode = function (client, user, scope) {
      if (this.model.generateAuthorizationCode) {
        // Replace this
        //return promisify(this.model.generateAuthorizationCode).call(this.model, client, user, scope);
        // With this
        return this.model.generateAuthorizationCode(client, user, scope)
      }
      return tokenUtil.generateRandomToken();
    };
    */

    log({
      title: "Generate Authorization Code",
      parameters: [
        { name: "client", value: client },
        { name: "user", value: user },
      ],
    });

    const seed = crypto.randomBytes(256);
    const code = crypto.createHash("sha1").update(seed).digest("hex");

    return code;
  },
  saveAuthorizationCode: async (code, client, user) => {
    /* This is where you store the access code data into the database */
    log({
      title: "Save Authorization Code",
      parameters: [
        { name: "code", value: code },
        { name: "client", value: client },
        { name: "user", value: user },
      ],
    });
    const authorizationCode = {
      ...code,
      userId: user.id,
      clientId: client.id,
      client: client,
      user: user,
    };

    await authorizationCodeDao.createAuthorizationCode(authorizationCode);
    // Write data code
    return new Promise(async (resolve) => {
      return resolve(
        Object.assign(
          {
            redirectUri: `${code.redirectUri}`,
          },
          authorizationCode
        )
      );
    });
  },
  getAuthorizationCode: async (authorizationCode) => {
    /* this is where we fetch the stored data from the code */
    log({
      title: "Get Authorization code",
      parameters: [{ name: "authorizationCode", value: authorizationCode }],
      attributes: [[Sequelize.col("User"), "user"]],
    });

    let code = await authorizationCodeDao.findAuthorizationCode({
      authorizationCode,
    });
    if (!code) throw new Error("Authorization Code not found");

    // format data
    code.expires_at = new Date(code.expires_at);
    code = camelcaseKeys(code, { deep: true });

    return new Promise((resolve) => {
      resolve(camelcaseKeys(code, { deep: true }));
    });
  },
  revokeAuthorizationCode: async (authorizationCode) => {
    /* This is where we delete codes */
    log({
      title: "Revoke Authorization Code",
      parameters: [{ name: "authorizationCode", value: authorizationCode }],
    });
    const codeWasFoundAndDeleted =
      await authorizationCodeDao.deleteAuthorizationCode({
        id: authorizationCode.id,
      });

    return new Promise((resolve) => resolve(codeWasFoundAndDeleted));
  },
  verifyScope: (token, scope) => {
    /* This is where we check to make sure the client has access to this scope */
    log({
      title: "Verify Scope",
      parameters: [
        { name: "token", value: token },
        { name: "scope", value: scope },
      ],
    });
    const userHasAccess = true; // return true if this user / client combo has access to this resource
    return new Promise((resolve) => resolve(userHasAccess));
  },
};

function log({ title, parameters }) {
  DebugControl.log.functionName(title);
  DebugControl.log.parameters(parameters);
}
