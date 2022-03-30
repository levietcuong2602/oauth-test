const path = require("path"); // has path and __dirname
const express = require("express");
const oauthServer = require("../oauth/server.js");

const DebugControl = require("../utilities/debug.js");
const res = require("express/lib/response");

const router = express.Router(); // Instantiate a new router

const filePath = path.join(__dirname, "../public/oauthAuthenticate.html");

router.get("/", (req, res) => {
  // send back a simple form for the oauth
  res.sendFile(filePath);
});

/**
 * This function comment is parsed by doctrine
 * @route POST /oauth/authorize login with username/password
 * @param {string} username.required - username or email - eg: user@domain
 * @param {string} password.requuired - user's password.
 * @param {string} client_id.requuired - user's client.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post(
  "/authorize",
  (req, res, next) => {
    DebugControl.log.flow("Initial User Authentication");
    const { username, password } = req.body;
    if (username === "username" && password === "password") {
      req.body.user = { user: 1 };
      return next();
    }
    const params = [
      // Send params back down
      "client_id",
      "redirect_uri",
      "response_type",
      "grant_type",
      "state",
    ]
      .map((a) => `${a}=${req.body[a]}`)
      .join("&");
    return res.redirect(`/oauth?success=false&${params}`);
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
 * This function comment is parsed by doctrine
 * @route POST /oauth/authorize login
 * @param {string} wallet_address.required - username or email - eg: user@domain
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post(
  "/authorize-wallet",
  (req, res, next) => {
    DebugControl.log.flow("Initial User Authentication");
    const { username, password } = req.body;
    if (username === "username" && password === "password") {
      req.body.user = { user: 1 };
      return next();
    }
    const params = [
      // Send params back down
      "client_id",
      "redirect_uri",
      "response_type",
      "grant_type",
      "state",
    ]
      .map((a) => `${a}=${req.body[a]}`)
      .join("&");
    return res.redirect(`/oauth?success=false&${params}`);
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
 * This function comment is parsed by doctrine
 * @route POST /oauth/token get access & refresh token
 * @param {string} authorization_code.required - username or email - eg: user@domain
 * @param {string} client_id.required - user's password.
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
 * @route POST /oauth/revoke   revoke access_token
 */

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

// api admin sso?
// entity user
/**
 * @route POST /users  CRUD user
 */

/**
 * @route GET /users  CRUD user
 */

/**
 * @route PUT /users  CRUD user
 */

// entity client
/**
 * @route POST /clients  CRUD client
 */
/**
 * @route PUT /clients  CRUD client
 */

/**
 * @route POST /clients  CRUD client
 */

// entity role
/**
 * @route POST /roles  CRUD role
 */

/**
 * @route PUT /roles  CRUD role
 */

// entity user role
/**
 * @route POST /user-roles  CRUD role
 */

/**
 * @route PUT /user-roles  CRUD role
 */

module.exports = router;
