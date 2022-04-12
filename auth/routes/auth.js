const path = require("path"); // has path and __dirname
const express = require("express");
const router = express.Router(); // Instantiate a new router

const oauthServer = require("../oauth/server.js");

const {
  registerAccountValidate,
  authorizeAccountValidate,
  authorizeMobileAccountValidate,
  generateNonceSessionValidate,
  verifySignatureValidate,
  combineAccountAndWalletValidate,
} = require("../validations/auth");
const authController = require("../controllers/auth");

const { authenticationLogin } = require("../middlewares/authenticate");
const asyncMiddleware = require("../middlewares/async");

const DebugControl = require("../utilities/debug.js");

const filePath = path.join(__dirname, "../public/oauthAuthenticate.html");

router.get("/", (req, res) => {
  // send back a simple form for the oauth
  res.sendFile(filePath);
});

/**
 * User
 * @typedef {object} User
 * @property {string} username.required - Email of user
 * @property {string} password.required - Password
 * @property {string} client_id.required - Client ID
 */

/**
 * Authorize Infomation
 * @typedef {object} Authorize
 * @property {string} client_id.required - Client ID
 * @property {string} redirect_uri.required - Redirect URI
 * @property {string} response_type.required - Response Type
 * @property {string} grant_type.required - Grant Type
 * @property {string} state.required - State
 * @property {string} username.required - Email of user
 * @property {string} password.required - Password
 */

/**
 * Authorize Infomation
 * @typedef {object} Authorize
 * @property {string} client_id.required - Client ID
 * @property {string} redirect_uri.required - Redirect URI
 * @property {string} response_type.required - Response Type
 * @property {string} grant_type.required - Grant Type
 * @property {string} state.required - State
 * @property {string} username.required - Email of user
 * @property {string} password.required - Password
 */

/**
 * Session Infomation
 * @typedef {object} Session
 * @property {string} client_id.required - Client ID
 * @property {string} wallet_address.required - Wallet Address
 */

/**
 * VerifySignatureBody Infomation
 * @typedef {object} VerifySignatureBody
 * @property {string} client_id.required - Client ID
 * @property {string} wallet_address.required - Wallet Address
 * @property {string} signature.required - Signature
 * @property {string} session_id.required - Session ID
 */

/**
 * CombineAccountsBody Infomation
 * @typedef {object} CombineAccountsBody
 * @property {string} account_token.required - Account Token
 * @property {string} wallet_token.required - Wallet Token
 */

/**
 * POST /oauth/signup
 * @summary Signup
 * @tags User
 * @param {User} request.body.required
 * @return {object} 200 - success response
 * @example request
 * {
 *   "username": "user@gmail.com",
 *   "password": "password123",
 *   "client_id": "f3e0f812385b7a21a075d047670254e21eb05914"
 * }
 * @example response - 200 - success response
 * {
 *    "code": 200,
 *    "status": 1,
 *    "data": {
 *        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2LCJ1c2VybmFtZSI6InVzZXIyQGdtYWlsLmNvbSJ9LCJjbGllbnQiOnsiaWQiOjEsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsImdyYW50cyI6IltcImF1dGhvcml6YXRpb25fY29kZVwiLFwicmVmcmVzaF90b2tlblwiXSJ9LCJyb2xlcyI6W3sicm9sZUlkIjozLCJjbGllbnRJZCI6ImYzZTBmODEyMzg1YjdhMjFhMDc1ZDA0NzY3MDI1NGUyMWViMDU5MTQiLCJyb2xlTmFtZSI6InVzZXIifV0sImlhdCI6MTY0OTMxNjIxNiwiZXhwIjoxNjQ5MzE4MDE2fQ.Jxp-wtlzNmxX9_1n0rxHo6JU4YljaGPUX-EvHssPzPc",
 *        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2LCJ1c2VybmFtZSI6InVzZXIyQGdtYWlsLmNvbSJ9LCJjbGllbnQiOnsiaWQiOjEsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsImdyYW50cyI6IltcImF1dGhvcml6YXRpb25fY29kZVwiLFwicmVmcmVzaF90b2tlblwiXSJ9LCJyb2xlcyI6W3sicm9sZUlkIjozLCJjbGllbnRJZCI6ImYzZTBmODEyMzg1YjdhMjFhMDc1ZDA0NzY3MDI1NGUyMWViMDU5MTQiLCJyb2xlTmFtZSI6InVzZXIifV0sImlhdCI6MTY0OTMxNjIxNiwiZXhwIjoxNjQ5OTIxMDE2fQ.Nu2IxYbM42ZSiHYbHIlUfLesd_vKDn-2ABIl4UjZ0hA",
 *        "refresh_token_expires_at": "2022-04-07T07:23:36.614Z",
 *        "token_expires_at": "2022-04-07T07:23:36.627Z",
 *        "token_type": "Bearer"
 *    }
 * }
 */
router.post(
  "/signup",
  registerAccountValidate,
  asyncMiddleware(authController.registerAccount)
);

/**
 * POST /oauth/authorize
 * @summary Get authorization code
 * @tags User
 * @param {Authorize} request.body.required
 * @return 200 - redirect to redirect_uri
 * @example request
 * {
 *     "client_id": "f3e0f812385b7a21a075d047670254e21eb05914",
 *     "redirect_uri": "http://localhost:3030/client/app",
 *     "response_type": "code",
 *     "grant_type": "authorization_code",
 *     "state": "myState",
 *     "username": "user2@gmail.com",
 *     "password": "123"
 * }
 */
router.post(
  "/authorize",
  authorizeAccountValidate,
  authenticationLogin,
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
 * POST /oauth/authorize-mobiles
 * @summary Get authorization code for mobile app
 * @tags User
 * @param {User} request.body.required
 * @return {object} - 200 - success response
 * @example request
 * {
 *   "username": "user@gmail.com",
 *   "password": "password123",
 *   "client_id": "f3e0f812385b7a21a075d047670254e21eb05914"
 * }
 * @example response - 200 - success response
 * {
 *   "code": 200,
 *   "data": {
 *     "code": "71fbd243a920984c1bba8395a314872819d3e36c",
 *     "expires_at": "2022-04-08T03:35:18.894Z"
 *   },
 *   "status": 1
 * }
 */
router.post(
  "/authorize-mobiles",
  authorizeMobileAccountValidate,
  authenticationLogin,
  (req, res, next) => {
    // sends us to our redirect with an authorization code in our url
    DebugControl.log.flow("Authorization Mobile");
    return next();
  },
  asyncMiddleware(authController.getAuthorizationTokenByMobile)
);

/**
 * POST /oauth/token
 * @summary Get access token and refresh token from authorization code
 * @tags User
 * @param {string} client_id.form.required - Client ID. <br>Ex: f3e0f812385b7a21a075d047670254e21eb05914 - application/x-www-form-urlencoded
 * @param {string} client_secret.form.required - Client Secret. <br>Ex: 71775764d7cbd01a2a9c22a987026bc4da9370b5 - application/x-www-form-urlencoded
 * @param {string} code.form.required - Authorization Code. <br>Ex: ffe6b1e060cd62103bc88355fcc28be2ad1c9b50 - application/x-www-form-urlencoded
 * @param {string} grant_type.form.required - Grant Type. <br>Ex: authorization_code - application/x-www-form-urlencoded
 * @param {string} username.form.required - Email of user. <br>Ex: user2@gmail.com - application/x-www-form-urlencoded
 * @param {string} password.form.required - Password of user. <br>Ex: password123 - application/x-www-form-urlencoded
 * @param {string} redirect_uri.form.required - Redirect URI. <br>Ex: http://localhost:3030/client/app - application/x-www-form-urlencoded
 * @return {object} 200 - success response
 * @return {object} 400 - bad request
 * @example response - 200 - success response
 * {
 *   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiaWQiOjEsIm5hbWUiOiJtYXJrZXRwbGFjZSIsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsImNsaWVudFNlY3JldCI6IjcxNzc1NzY0ZDdjYmQwMWEyYTljMjJhOTg3MDI2YmM0ZGE5MzcwYjUiLCJyZWRpcmVjdFVyaXMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDMwL2NsaWVudC9hcHAiXSwiZ3JhbnRzIjpbImF1dGhvcml6YXRpb25fY29kZSIsInJlZnJlc2hfdG9rZW4iXX0sInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoidXNlcjJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIwZGMxYTYxMDVkYzFiMjc1NjllODI5M2M1NGNlYjFmYTpkMzM1NjAzMjQ5M2I1NTc2ODE3OTY3ODA4NTk1ODVhNjJlZTkwOWI1NDk2ZWU3ODRiYzFiNDI0ODI4MDkyZDk0ZWU2MTkxYmY1YWEwYTJmMDExYTA3ZTVjYTE0N2UxYWM0YTJiZTk0NGVlNTQyZmQ5Njk4NTRmMTciLCJ3YWxsZXRBZGRyZXNzIjpudWxsfSwicm9sZXMiOlt7InJvbGVJZCI6MywiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0Iiwicm9sZU5hbWUiOiJ1c2VyIn1dLCJpYXQiOjE2NDkzMTY3NjMsImV4cCI6MTY0OTMxODU2M30.gNDHu7Wgl8wfWcbXm4r4CgkgbTd_E0f51fjNYsvjEQQ",
 *   "expires_in": 1209599,
 *   "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiaWQiOjEsIm5hbWUiOiJtYXJrZXRwbGFjZSIsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsImNsaWVudFNlY3JldCI6IjcxNzc1NzY0ZDdjYmQwMWEyYTljMjJhOTg3MDI2YmM0ZGE5MzcwYjUiLCJyZWRpcmVjdFVyaXMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDMwL2NsaWVudC9hcHAiXSwiZ3JhbnRzIjpbImF1dGhvcml6YXRpb25fY29kZSIsInJlZnJlc2hfdG9rZW4iXX0sInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoidXNlcjJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIwZGMxYTYxMDVkYzFiMjc1NjllODI5M2M1NGNlYjFmYTpkMzM1NjAzMjQ5M2I1NTc2ODE3OTY3ODA4NTk1ODVhNjJlZTkwOWI1NDk2ZWU3ODRiYzFiNDI0ODI4MDkyZDk0ZWU2MTkxYmY1YWEwYTJmMDExYTA3ZTVjYTE0N2UxYWM0YTJiZTk0NGVlNTQyZmQ5Njk4NTRmMTciLCJ3YWxsZXRBZGRyZXNzIjpudWxsfSwicm9sZXMiOlt7InJvbGVJZCI6MywiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0Iiwicm9sZU5hbWUiOiJ1c2VyIn1dLCJpYXQiOjE2NDkzMTY3NjMsImV4cCI6MTY0OTkyMTU2M30.TJRbKZBq7qxPGUzqsixYDC5jQVDt6SuF5T8JZGuqmWg",
 *   "token_type": "Bearer"
 * }
 * @example response - 400 - authorization code invalid
 * {
 *     "code": 400,
 *     "status": 0,
 *     "message": "Invalid grant: authorization code is invalid",
 *     "data": null
 * }
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
 * POST /oauth/me
 * @summary Get user info from access token
 * @tags User
 * @param {string} Authorization.header.required - Bearer token.
 * @return {object} 200 - success response
 * @example response - 200 - success response
 * {
 *    "data": {
 *       "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiaWQiOjEsIm5hbWUiOiJtYXJrZXRwbGFjZSIsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsImNsaWVudFNlY3JldCI6IjcxNzc1NzY0ZDdjYmQwMWEyYTljMjJhOTg3MDI2YmM0ZGE5MzcwYjUiLCJyZWRpcmVjdFVyaXMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDMwL2NsaWVudC9hcHAiXSwiZ3JhbnRzIjpbImF1dGhvcml6YXRpb25fY29kZSIsInJlZnJlc2hfdG9rZW4iXX0sInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoidXNlcjJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIwZGMxYTYxMDVkYzFiMjc1NjllODI5M2M1NGNlYjFmYTpkMzM1NjAzMjQ5M2I1NTc2ODE3OTY3ODA4NTk1ODVhNjJlZTkwOWI1NDk2ZWU3ODRiYzFiNDI0ODI4MDkyZDk0ZWU2MTkxYmY1YWEwYTJmMDExYTA3ZTVjYTE0N2UxYWM0YTJiZTk0NGVlNTQyZmQ5Njk4NTRmMTciLCJ3YWxsZXRBZGRyZXNzIjpudWxsfSwicm9sZXMiOlt7InJvbGVJZCI6MywiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0Iiwicm9sZU5hbWUiOiJ1c2VyIn1dLCJpYXQiOjE2NDkzMTYzNzksImV4cCI6MTY0OTMxODE3OX0.ut-1oeABKu0Bp9tIjIYl9fUE5Jn2SjEVLgG4WtKrdR0",
 *       "access_token_expires_at": "2022-04-21T07:26:19.000Z",
 *       "client": {
 *          "client_id": "f3e0f812385b7a21a075d047670254e21eb05914",
 *          "client_secret": "71775764d7cbd01a2a9c22a987026bc4da9370b5",
 *          "id": 1
 *       },
 *       "user": {
 *          "id": 6,
 *          "username": "user2@gmail.com",
 *          "wallet_address": null
 *       }
 *    },
 *    "status": 1
 * }
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
 * POST /oauth/nonces
 * @summary Get Nonces To Sign Message
 * @tags User
 * @param {Session} request.body.required
 * @return {object} 200 - success response
 * @example request
 * {
 *        "wallet_address": "0xE5Df21aE71628A4c0C4655a5f3c90A56bA5393FF",
 *        "client_id": "f3e0f812385b7a21a075d047670254e21eb05914"
 * }
 * @example response - 200 - success response
 * {
 *       "client_id": 1,
 *       "expires_at": "2022-04-08T07:55:58.344Z",
 *       "id": 1,
 *       "nonce": "43f94ac9019b5bdae5014bf0151abcc2a5a27657"
 * }
 */
router.post(
  "/nonces",
  generateNonceSessionValidate,
  asyncMiddleware(authController.generateNonceSession)
);

/**
 * POST /oauth/verify-signature
 * @summary Verify Signature
 * @tags User
 * @param {VerifySignatureBody} request.body.required
 * @return {object} 200 - success response
 * @example request
 * {
 *       "wallet_address": "0xE5Df21aE71628A4c0C4655a5f3c90A56bA5393FF",
 *       "client_id": "f3e0f812385b7a21a075d047670254e21eb05914",
 *       "signature": "0x9a96671ce4f075283a1aa733f557a2de14d8b364c6715369524258f8740fa840177d41ff3e0c95755fad49e5a4a04419f32258c34a918490c82d6a8f6718fe371b",
 *       "session_id": 10
 * }
 * @example response - 200 - success response
 * {
 *       "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyNywidXNlcm5hbWUiOm51bGwsIndhbGxldEFkZHJlc3MiOiIweEU1RGYyMWFFNzE2MjhBNGMwQzQ2NTVhNWYzYzkwQTU2YkE1MzkzRkYifSwiY2xpZW50Ijp7ImlkIjoxLCJjbGllbnRJZCI6ImYzZTBmODEyMzg1YjdhMjFhMDc1ZDA0NzY3MDI1NGUyMWViMDU5MTQiLCJncmFudHMiOiJbXCJhdXRob3JpemF0aW9uX2NvZGVcIixcInJlZnJlc2hfdG9rZW5cIixcInBhc3N3b3JkXCJdIn0sInJvbGVzIjpbXSwiaWF0IjoxNjQ5NDA5NjgxLCJleHAiOjE2NDk0MDk2ODJ9.5o6HyTr7UErtL2MUKM48M3vJ2_zoFOsMyV_BC4m36uY",
 *       "refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyNywidXNlcm5hbWUiOm51bGwsIndhbGxldEFkZHJlc3MiOiIweEU1RGYyMWFFNzE2MjhBNGMwQzQ2NTVhNWYzYzkwQTU2YkE1MzkzRkYifSwiY2xpZW50Ijp7ImlkIjoxLCJjbGllbnRJZCI6ImYzZTBmODEyMzg1YjdhMjFhMDc1ZDA0NzY3MDI1NGUyMWViMDU5MTQiLCJncmFudHMiOiJbXCJhdXRob3JpemF0aW9uX2NvZGVcIixcInJlZnJlc2hfdG9rZW5cIixcInBhc3N3b3JkXCJdIn0sInJvbGVzIjpbXSwiaWF0IjoxNjQ5NDA5NjgxLCJleHAiOjE2NTAwMTQ0ODF9.G35kfEkorRNT_iXZOXIsE8gtz9J8RBolhS0-3_tNXaw",
 *       "refresh_token_expires_at":"2022-04-15T09:21:21.490Z",
 *       "token_expires_at":"2022-04-08T09:51:21.496Z",
 *       "token_type":"Bearer"
 * }
 */
router.post(
  "/verify-signature",
  verifySignatureValidate,
  asyncMiddleware(authController.verifySignature)
);

/**
 * POST /oauth/combine-accounts
 * @summary Combine account and wallet
 * @tags User
 * @param {CombineAccountsBody} request.body.required
 * @return {object} 200 - success response
 * @example request
 * {
 *        "account_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W3sicm9sZUlkIjozLCJjbGllbnRJZCI6ImYzZTBmODEyMzg1YjdhMjFhMDc1ZDA0NzY3MDI1NGUyMWViMDU5MTQiLCJyb2xlTmFtZSI6InVzZXIifV0sImNsaWVudCI6eyJpZCI6MSwibmFtZSI6Im1hcmtldHBsYWNlIiwiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0IiwiY2xpZW50U2VjcmV0IjoiNzE3NzU3NjRkN2NiZDAxYTJhOWMyMmE5ODcwMjZiYzRkYTkzNzBiNSIsInJlZGlyZWN0VXJpcyI6WyJodHRwOi8vbG9jYWxob3N0OjMwMzAvY2xpZW50L2FwcCJdLCJncmFudHMiOlsiYXV0aG9yaXphdGlvbl9jb2RlIiwicmVmcmVzaF90b2tlbiIsInBhc3N3b3JkIl19LCJ1c2VyIjp7ImlkIjoyMywidXNlcm5hbWUiOiJjdW9uZ2x2MUBnbWFpbC5jb20ifSwiaWF0IjoxNjQ5NzQ5NzU5LCJleHAiOjE2NDk3Njc3NTl9.ifAfT0K2bD-DUmwzOblAGyzJ8VZkxhKY_dh6g_b-nTc",
 *        "wallet_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozMiwid2FsbGV0QWRkcmVzcyI6IjB4RTVEZjIxYUU3MTYyOEE0YzBDNDY1NWE1ZjNjOTBBNTZiQTUzOTNGRiJ9LCJjbGllbnQiOnsiaWQiOjIsImNsaWVudElkIjoiMzA1ZjgzZjViNzdkZTY0MzE2OThiYThlMzhiOTIxNjQzY2ExZDU1ZCIsImdyYW50cyI6IltcImF1dGhvcml6YXRpb25fY29kZVwiXSJ9LCJyb2xlcyI6W3sicm9sZUlkIjozLCJjbGllbnRJZCI6IjMwNWY4M2Y1Yjc3ZGU2NDMxNjk4YmE4ZTM4YjkyMTY0M2NhMWQ1NWQiLCJyb2xlTmFtZSI6InVzZXIifV0sImlhdCI6MTY0OTc1MDIzOCwiZXhwIjoxNjQ5NzY4MjM4fQ.kLLKGUPS2I6CMpTDoCab_CNzsjGEdrdXPNsP0ms54bE"
 * }
 * @example response - 200 - success response
 * {
 *        "code":200,
 *        "data":{
 *          "id":23,
 *          "username":"cuonglv1@gmail.com",
 *          "wallet_address":"0xE5Df21aE71628A4c0C4655a5f3c90A56bA5393FF"
 *        },
 *        "status":1
 * }
 */
// check middleware login account and verify sign message
router.post(
  "/combine-accounts",
  (req, res, next) => {
    DebugControl.log.flow("Combine Account And Wallet");
    next();
  },
  combineAccountAndWalletValidate,
  asyncMiddleware(authController.combineAccountAndWallet)
);

module.exports = router;
