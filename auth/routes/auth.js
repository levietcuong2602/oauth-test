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
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: email of user.
 *           example: user@gmail.com
 *         password:
 *           type: string
 *           description: password of account
 *           example: password123
 *         client_id:
 *           type: string
 *           description: client id
 *           example: f3e0f812385b7a21a075d047670254e21eb05914
 *     Authorize:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: email of user.
 *           example: user@gmail.com
 *         password:
 *           type: string
 *           description: password of account
 *           example: password123
 *         client_id:
 *           type: string
 *           description: client id
 *           example: f3e0f812385b7a21a075d047670254e21eb05914
 *         redirect_uri:
 *           type: string
 *           description: redirect uri.
 *           example: http://localhost:3030/client/app
 *         response_type:
 *           type: string
 *           description: response type
 *           example: code
 *         grant_type:
 *           type: string
 *           description: grant type
 *           example: authorization_code
 *         state:
 *           type: string
 *           description: state
 *           example: myState
 */

/**
 * @swagger
 * /oauth/signup:
 *   post:
 *     description: Signup
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: user infomation.
 *         schema:
 *           $ref: '#/components/schemas/NewUser'
 *     responses:
 *       200:
 *         description: '{"code":200,"data":{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0LCJ1c2VybmFtZSI6InVzZXJAZ21haWwuY29tIn0sImNsaWVudCI6eyJpZCI6MSwiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0IiwiZ3JhbnRzIjoiW1wiYXV0aG9yaXphdGlvbl9jb2RlXCIsXCJyZWZyZXNoX3Rva2VuXCJdIn0sInJvbGVzIjpbeyJyb2xlSWQiOjMsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsInJvbGVOYW1lIjoidXNlciJ9XSwiaWF0IjoxNjQ5MzA0MDE3LCJleHAiOjE2NDkzMDU4MTd9.bQXNMLs2cj0UZ7IMvjYYVJQf6mEgybL2uAZvw1sw8qI","refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0LCJ1c2VybmFtZSI6InVzZXJAZ21haWwuY29tIn0sImNsaWVudCI6eyJpZCI6MSwiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0IiwiZ3JhbnRzIjoiW1wiYXV0aG9yaXphdGlvbl9jb2RlXCIsXCJyZWZyZXNoX3Rva2VuXCJdIn0sInJvbGVzIjpbeyJyb2xlSWQiOjMsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsInJvbGVOYW1lIjoidXNlciJ9XSwiaWF0IjoxNjQ5MzA0MDE3LCJleHAiOjE2NDk5MDg4MTd9.ESpeHO8SwVxCnbpttP3CdScAcK4K0ZBBWJB8neFauLE","refresh_token_expires_at":"2022-04-07T04:00:17.679Z","roles":[{"client_id":"f3e0f812385b7a21a075d047670254e21eb05914","role_id":3,"role_name":"user"}],"token_expires_at":"2022-04-07T04:00:17.704Z","token_type":"Bearer","user":{"id":4,"username":"user@gmail.com"}},"status":1}'
 *       500:
 *         description: '{"code":500,"status":0,"message":"User already exists with same username","data":null}'
 */
router.post(
  "/signup",
  registerAccountValidate,
  asyncMiddleware(authController.registerAccount)
);

/**
 * @swagger
 * /oauth/authorize:
 *   post:
 *     description: Get authorization code
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: user infomation.
 *         schema:
 *           $ref: '#/components/schemas/Authorize'
 *     responses:
 *       200:
 *         description: redirect to redirect_uri
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
 * @swagger
 * /oauth/token:
 *   post:
 *     description: Get access token and refresh token from authorization code, send request as <b>x-www-form-urlencoded</b> in <b>request body</b>
 *     parameters:
 *       - in: formData
 *         name: client_id
 *         required: true
 *         description: client ID
 *         schema:
 *           type: string
 *         example: f3e0f812385b7a21a075d047670254e21eb05914
 *       - in: formData
 *         name: client_secret
 *         required: true
 *         description: client secret
 *         schema:
 *           type: string
 *         example: 71775764d7cbd01a2a9c22a987026bc4da9370b5
 *       - in: formData
 *         name: code
 *         required: true
 *         description: authorization code
 *         schema:
 *           type: string
 *         example: 51c06ea13e75f6db6bca5a9c479cc5b168d2a094
 *       - in: formData
 *         name: grant_type
 *         required: true
 *         description: type of grant
 *         schema:
 *           type: string
 *         example: authorization_code
 *       - in: formData
 *         name: username
 *         required: true
 *         description: username
 *         schema:
 *           type: string
 *         example: manhvd@gmail.com
 *       - in: formData
 *         name: password
 *         required: true
 *         description: password
 *         schema:
 *           type: string
 *         example: password123
 *       - in: formData
 *         name: redirect_uri
 *         required: true
 *         description: redirect_uri
 *         schema:
 *           type: string
 *         example: http://localhost:3030/client/app
 *     responses:
 *       200:
 *         description: '{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiaWQiOjEsIm5hbWUiOiJtYXJrZXRwbGFjZSIsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsImNsaWVudFNlY3JldCI6IjcxNzc1NzY0ZDdjYmQwMWEyYTljMjJhOTg3MDI2YmM0ZGE5MzcwYjUiLCJyZWRpcmVjdFVyaXMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDMwL2NsaWVudC9hcHAiXSwiZ3JhbnRzIjpbImF1dGhvcml6YXRpb25fY29kZSIsInJlZnJlc2hfdG9rZW4iXX0sInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoidXNlcjJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIwZGMxYTYxMDVkYzFiMjc1NjllODI5M2M1NGNlYjFmYTpkMzM1NjAzMjQ5M2I1NTc2ODE3OTY3ODA4NTk1ODVhNjJlZTkwOWI1NDk2ZWU3ODRiYzFiNDI0ODI4MDkyZDk0ZWU2MTkxYmY1YWEwYTJmMDExYTA3ZTVjYTE0N2UxYWM0YTJiZTk0NGVlNTQyZmQ5Njk4NTRmMTciLCJ3YWxsZXRBZGRyZXNzIjpudWxsfSwicm9sZXMiOlt7InJvbGVJZCI6MywiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0Iiwicm9sZU5hbWUiOiJ1c2VyIn1dLCJpYXQiOjE2NDkzMTY3NjMsImV4cCI6MTY0OTMxODU2M30.gNDHu7Wgl8wfWcbXm4r4CgkgbTd_E0f51fjNYsvjEQQ","expires_in":1209599,"refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiaWQiOjEsIm5hbWUiOiJtYXJrZXRwbGFjZSIsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsImNsaWVudFNlY3JldCI6IjcxNzc1NzY0ZDdjYmQwMWEyYTljMjJhOTg3MDI2YmM0ZGE5MzcwYjUiLCJyZWRpcmVjdFVyaXMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDMwL2NsaWVudC9hcHAiXSwiZ3JhbnRzIjpbImF1dGhvcml6YXRpb25fY29kZSIsInJlZnJlc2hfdG9rZW4iXX0sInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoidXNlcjJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIwZGMxYTYxMDVkYzFiMjc1NjllODI5M2M1NGNlYjFmYTpkMzM1NjAzMjQ5M2I1NTc2ODE3OTY3ODA4NTk1ODVhNjJlZTkwOWI1NDk2ZWU3ODRiYzFiNDI0ODI4MDkyZDk0ZWU2MTkxYmY1YWEwYTJmMDExYTA3ZTVjYTE0N2UxYWM0YTJiZTk0NGVlNTQyZmQ5Njk4NTRmMTciLCJ3YWxsZXRBZGRyZXNzIjpudWxsfSwicm9sZXMiOlt7InJvbGVJZCI6MywiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0Iiwicm9sZU5hbWUiOiJ1c2VyIn1dLCJpYXQiOjE2NDkzMTY3NjMsImV4cCI6MTY0OTkyMTU2M30.TJRbKZBq7qxPGUzqsixYDC5jQVDt6SuF5T8JZGuqmWg","token_type":"Bearer"}'
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
 * @swagger
 * /oauth/me:
 *   post:
 *     description: Get user info from access token
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: this is access token
 *         schema:
 *           type: string
 *         example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiaWQiOjEsIm5hbWUiOiJtYXJrZXRwbGFjZSIsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsImNsaWVudFNlY3JldCI6IjcxNzc1NzY0ZDdjYmQwMWEyYTljMjJhOTg3MDI2YmM0ZGE5MzcwYjUiLCJyZWRpcmVjdFVyaXMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDMwL2NsaWVudC9hcHAiXSwiZ3JhbnRzIjpbImF1dGhvcml6YXRpb25fY29kZSIsInJlZnJlc2hfdG9rZW4iXX0sInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoidXNlcjJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIwZGMxYTYxMDVkYzFiMjc1NjllODI5M2M1NGNlYjFmYTpkMzM1NjAzMjQ5M2I1NTc2ODE3OTY3ODA4NTk1ODVhNjJlZTkwOWI1NDk2ZWU3ODRiYzFiNDI0ODI4MDkyZDk0ZWU2MTkxYmY1YWEwYTJmMDExYTA3ZTVjYTE0N2UxYWM0YTJiZTk0NGVlNTQyZmQ5Njk4NTRmMTciLCJ3YWxsZXRBZGRyZXNzIjpudWxsfSwicm9sZXMiOlt7InJvbGVJZCI6MywiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0Iiwicm9sZU5hbWUiOiJ1c2VyIn1dLCJpYXQiOjE2NDkzMTYzNzksImV4cCI6MTY0OTMxODE3OX0.ut-1oeABKu0Bp9tIjIYl9fUE5Jn2SjEVLgG4WtKrdR0
 *     responses:
 *       200:
 *         description: '{"data":{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnQiOnsiaWQiOjEsIm5hbWUiOiJtYXJrZXRwbGFjZSIsImNsaWVudElkIjoiZjNlMGY4MTIzODViN2EyMWEwNzVkMDQ3NjcwMjU0ZTIxZWIwNTkxNCIsImNsaWVudFNlY3JldCI6IjcxNzc1NzY0ZDdjYmQwMWEyYTljMjJhOTg3MDI2YmM0ZGE5MzcwYjUiLCJyZWRpcmVjdFVyaXMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDMwL2NsaWVudC9hcHAiXSwiZ3JhbnRzIjpbImF1dGhvcml6YXRpb25fY29kZSIsInJlZnJlc2hfdG9rZW4iXX0sInVzZXIiOnsiaWQiOjYsInVzZXJuYW1lIjoidXNlcjJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIwZGMxYTYxMDVkYzFiMjc1NjllODI5M2M1NGNlYjFmYTpkMzM1NjAzMjQ5M2I1NTc2ODE3OTY3ODA4NTk1ODVhNjJlZTkwOWI1NDk2ZWU3ODRiYzFiNDI0ODI4MDkyZDk0ZWU2MTkxYmY1YWEwYTJmMDExYTA3ZTVjYTE0N2UxYWM0YTJiZTk0NGVlNTQyZmQ5Njk4NTRmMTciLCJ3YWxsZXRBZGRyZXNzIjpudWxsfSwicm9sZXMiOlt7InJvbGVJZCI6MywiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0Iiwicm9sZU5hbWUiOiJ1c2VyIn1dLCJpYXQiOjE2NDkzMTYzNzksImV4cCI6MTY0OTMxODE3OX0.ut-1oeABKu0Bp9tIjIYl9fUE5Jn2SjEVLgG4WtKrdR0","access_token_expires_at":"2022-04-21T07:26:19.000Z","client":{"client_id":"f3e0f812385b7a21a075d047670254e21eb05914","client_secret":"71775764d7cbd01a2a9c22a987026bc4da9370b5","id":1},"user":{"id":6,"username":"user2@gmail.com","wallet_address":null}},"status":1}'
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
