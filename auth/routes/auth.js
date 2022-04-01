const path = require("path"); // has path and __dirname
const express = require("express");

const oauthServer = require("../oauth/server.js");
const userDao = require("../daos/user");
const clientDao = require("../daos/client");

const { authenticateRefresh } = require("../middlewares/authenticate");

const DebugControl = require("../utilities/debug.js");
const {
  compareBcrypt,
  encryptPassword,
  generateSalt,
} = require("../utilities/bcrypt");
const { decrypt } = require("../utilities/security");
const { hashSHA512 } = require("../utilities/security.js");
const { errorResponse, successResponse } = require("../utilities/response");
const res = require("express/lib/response");

const router = express.Router(); // Instantiate a new router

const filePath = path.join(__dirname, "../public/oauthAuthenticate.html");

router.get("/", (req, res) => {
  // send back a simple form for the oauth
  res.sendFile(filePath);
});

/**
 * register account
 * @route POST /oauth/register register account with username/password
 * @param {string} username.required - username or email - eg: user@domain
 * @param {string} password.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post("/register", async (req, res, next) => {
  try {
    DebugControl.log.flow("Register User");
    const { username, password } = req.body;
    // check username exists
    const user = await userDao.findUser({ username });
    if (user) throw new Error("User already exists with same email");

    const salt = generateSalt(10);
    const newUser = await userDao.createUser({
      password: await encryptPassword(password, salt),
      username,
      salt,
    });

    return successResponse(req, res, newUser);
  } catch (err) {
    return errorResponse({
      req,
      res,
      message: err.message,
    });
  }
});

/**
 * in flow login return authorization code
 * @route POST /oauth/authorize login with username/password
 * @param {string} username.required - username or email - eg: user@domain
 * @param {string} password.required - user's password.
 * @param {string} client_id.required - user's client.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post(
  "/authorize",
  async (req, res, next) => {
    try {
      DebugControl.log.flow("Initial User Authentication");
      const { username, password, client_id } = req.body;
      // check username exists
      const user = await userDao.findUser({ username });
      if (!user) throw new Error("User not found");

      // check clientId exists
      const client = await clientDao.findClient({ client_id });
      if (!client) throw new Error("Client not found");

      // check password
      const isCorrectPassword = await compareBcrypt(
        hashSHA512(password),
        decrypt(user.password)
      );
      if (!isCorrectPassword) throw new Error("Password incorrect");

      req.body.user = user;
      return next();
    } catch (err) {
      // const params = [
      //   // Send params back down
      //   "client_id",
      //   "redirect_uri",
      //   "response_type",
      //   "grant_type",
      //   "state",
      // ]
      //   .map((a) => `${a}=${req.body[a]}`)
      //   .join("&");
      // return res.redirect(`/oauth?success=false&${params}`);
      return errorResponse({
        req,
        res,
        message: err.message,
      });
    }
  },
  (req, res, next) => {
    // sends us to our redirect with an authorization code in our url
    DebugControl.log.flow("Authorization");
    return next();
  },
  oauthServer.authorize({
    authenticateHandler: {
      handle: (req) => {
        DebugControl.log.functionName("Authenticate Handler");
        DebugControl.log.parameters(
          Object.keys(req.body).map((k) => ({ name: k, value: req.body[k] }))
        );
        return req.body.user;
      },
    },
  })
);

/**
 * Authorize wallet
 * @route POST /oauth/authorize-wallet login
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post(
  "/authorize-wallet",
  (req, res, next) => {
    DebugControl.log.flow("Authorize Wallet");
  },
  (req, res, next) => {
    // sends us to our redirect with an Authorize Wallet code in our url
    DebugControl.log.flow("Authorize Wallet");
    return next();
  },
  oauthServer.authorize({
    authenticateHandler: {
      handle: (req) => {
        DebugControl.log.functionName("Authenticate Handler");
        DebugControl.log.parameters(
          Object.keys(req.body).map((k) => ({ name: k, value: req.body[k] }))
        );
        return req.body.user;
      },
    },
  })
);

/**
 * in flow get access token and refresh token from authorization code
 * @route POST /oauth/token get access & refresh token
 * @param {string} code.required - authorization code
 * @param {string} client_secret.required
 * @param {string} client_id.required
 * @param {string} grant_type.required
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post(
  "/token",
  (req, res, next) => {
    DebugControl.log.flow("Token");
    next();
  },
  oauthServer.token({
    requireClientAuthentication: {
      // whether client needs to provide client_secret
      // 'authorization_code': false,
    },
  })
); // Sends back token

/**
 * get new token from refresh token
 * @route POST /oauth/refresh get new refresh token and access token from refresh token
 * @param {string} refresh_token.required - refresh token
 * @param {string} client_secret.required
 * @param {string} client_id.required
 * @param {string} grant_type.required
 * @returns {object} 200 -  An object token info
 * @returns {Error} default - Unexpected error
 */
router.post(
  "/endpoint",
  (req, res, next) => {
    DebugControl.log.flow("Refresh");
    next();
  },
  authenticateRefresh,
  oauthServer.token({
    requireClientAuthentication: { authorization_code: false },
  })
);

/**
 * @route POST /oauth/revoke-refresh   revoke refresh_token
 */

/**
 * @route POST /oauth/revoke-token   revoke access_token
 */

/**
 * @route GET /oauth/me   get user info ???
 */

/**
 * @route POST /oauth/verify-user   verify user info
 */

/**
 * @route POST /oauth/association-link   link user with wallet
 */

module.exports = router;
