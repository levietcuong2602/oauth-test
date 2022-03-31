const path = require("path"); // has path and __dirname
const express = require("express");

const oauthServer = require("../oauth/server.js");
const userDao = require("../daos/user");
const clientDao = require("../daos/client");

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

const authorizeFailure = (req, res) => {
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
};

router.post("/register", async (req, res, next) => {
  try {
    DebugControl.log.flow("Register User");
    const { username, password } = req.body;
    // check username exists
    const user = await userDao.findOneUser({ username });
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
 * function login by username, password
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
      const user = await userDao.findOneUser({ username });
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
      code: "eae583f2b9493699f370ff805027eaaed6901dad",
      client_secret: "",
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
