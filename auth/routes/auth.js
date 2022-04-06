const path = require("path"); // has path and __dirname
const express = require("express");
const router = express.Router(); // Instantiate a new router

const oauthServer = require("../oauth/server.js");
const userDao = require("../daos/user");
const clientDao = require("../daos/client");

const {
  registerAccountValidate,
  authorizeAccountValidate,
} = require("../validations/auth");
const authController = require("../controllers/auth");

const { authenticationUser } = require("../middlewares/authenticate");
const asyncMiddleware = require("../middlewares/async");

const DebugControl = require("../utilities/debug.js");

const filePath = path.join(__dirname, "../public/oauthAuthenticate.html");

router.get("/", (req, res) => {
  // send back a simple form for the oauth
  res.sendFile(filePath);
});

/**
 * register account
 * @route POST /oauth/register register account with username, password, client_id
 * @param {string} username.required - username or email - eg: user@domain
 * @param {string} password.required - user's password.
 * @param {string} client_id.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post(
  "/register",
  registerAccountValidate,
  asyncMiddleware(authController.registerAccount)
);

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
  authorizeAccountValidate,
  authenticationUser,
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
    requireClientAuthentication: {},
  })
); // Sends back token

/**
 * get user info from access token
 * @route POST /oauth/me get user info from access token
 * @returns {object} 200 -  An object token info
 * @returns {Error} default - Unexpected error
 */
router.post(
  "/me",
  (req, res, next) => {
    DebugControl.log.flow("Me");
    next();
  },
  oauthServer.authenticate(),
  (req, res) => {
    return res.send({ data: res.locals.oauth.token, status: 1 });
  }
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
