const path = require("path"); // has path and __dirname
const express = require("express");

const userDao = require("../daos/user");
const { successResponse, errorResponse } = require("../utilities/response");
const asyncMiddleware = require("../middlewares/async");

const {
  createClientValidate,
  updateClientValidate,
  deleteClientValidate,
  createRoleValidate,
  updateRoleValidate,
  deleteRoleValidate,
  createUserRoleValidate,
  updateUserRoleValidate,
  deleteUserRoleValidate,
} = require("../validations/admin");
const adminController = require("../controllers/admin");

const router = express.Router(); // Instantiate a new router

router.get("/users/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const user = await userDao.findUser({ id: userId });
  if (!user) return errorResponse({ req, res, statusCode: 500 });

  return successResponse(req, res, user);
});

/**
 * NewClient
 * @typedef {object} NewClient
 * @property {string} name.required - The client's name
 * @property {array<string>} grants.required - Grant
 * @property {array<string>} redirect_uris.required - Client ID
 */

/**
 * GET /api/admin/clients/{id}
 * @summary Get client by ID
 * @tags Admin
 * @param {string} id.path.required - The client ID
 * @return {object} 200 - success response
 * @example response - 200 - success response
 * {
 *   "code": 200,
 *   "data": {
 *     "client_id": "9111ae7b45f9d41ec4c324d0e6e275fdbf3def09",
 *     "client_secret": "dbd57971d85ee2a8d5398b808e02fe7bb1108cea",
 *     "grants": [
 *       "authorization_code"
 *     ],
 *     "id": 11,
 *     "name": "client ABC",
 *     "redirect_uris": [
 *       "http://localhost:3030/client/app"
 *     ]
 *   },
 *   "status": 1
 * }
 */
router.get(
  "/clients/:clientId",
  asyncMiddleware(adminController.findClientById)
);

/**
 * POST /api/admin/clients
 * @summary Create a client
 * @tags Admin
 * @param {NewClient} request.body.required
 * @return {object} 200 - success response
 * @example request
 * {
 *     "name": "client A",
 *     "grants": ["authorization_code"],
 *     "redirect_uris": ["http://localhost:3030/client/app"]
 * }
 * @example response - 200 - success response
 * {
 *     "code": 200,
 *     "data": {
 *         "client_id": "cf84924c4c3bd2f213a0a5a73c39f7f2c3009a0c",
 *         "client_secret": "7c81e58382b4c49b7975900b8ecc8e54760a2a83",
 *         "grants": [
 *             "authorization_code"
 *         ],
 *         "id": 10,
 *         "name": "client A",
 *         "redirect_uris": [
 *             "http://localhost:3030/client/app"
 *         ]
 *     },
 *     "status": 1
 * }
 */
router.post(
  "/clients",
  createClientValidate,
  asyncMiddleware(adminController.createClient)
);

/**
 * PUT /api/admin/clients/{id}
 * @summary Update a client
 * @tags Admin
 * @param {string} id.path.required - The client ID
 * @param {NewClient} request.body.required - Name of client
 * @return {object} 200 - success response
 * @example request
 * {
 *     "name": "client ABC",
 *     "grants": ["authorization_code"],
 *     "redirect_uris": ["http://localhost:3030/client/app"]
 * }
 * @example response - 200 - success response
 * {
 *   "code": 200,
 *   "data": {
 *     "client_id": "9111ae7b45f9d41ec4c324d0e6e275fdbf3def09",
 *     "client_secret": "dbd57971d85ee2a8d5398b808e02fe7bb1108cea",
 *     "grants": [
 *       "authorization_code"
 *     ],
 *     "id": 11,
 *     "name": "client ABC",
 *     "redirect_uris": [
 *       "http://localhost:3030/client/app"
 *     ]
 *   },
 *   "status": 1
 * }
 */
router.put(
  "/clients/:client_id",
  updateClientValidate,
  asyncMiddleware(adminController.updateClient)
);

/**
 * DELETE /api/admin/clients/{id}
 * @summary Delete a client
 * @tags Admin
 * @param {string} id.path.required - The client ID
 * @return {object} 200 - success response
 * @example response - 200 - success response
 * {
 *   "code": 200,
 *   "status": 1
 * }
 */
router.delete(
  "/clients/:client_id",
  deleteClientValidate,
  asyncMiddleware(adminController.deleteClient)
);

/**
 * GET /api/admin/users
 * @summary Get list users
 * @tags Admin
 */

/**
 * PUT /api/admin/users
 * @summary Update user info
 * @tags Admin
 */

/**
 * POST /api/admin/roles
 * @summary Create role
 * @tags Admin
 */
router.post(
  "/roles",
  createRoleValidate,
  asyncMiddleware(adminController.createRole)
);

/**
 * PUT /api/admin/roles
 * @summary Update role
 * @tags Admin
 */
router.put(
  "/roles/:role_id",
  updateRoleValidate,
  asyncMiddleware(adminController.updateRole)
);

/**
 * DELETE /api/admin/roles
 * @summary Delete role
 * @tags Admin
 */
router.delete(
  "/roles/:role_id",
  deleteRoleValidate,
  asyncMiddleware(adminController.deleteRole)
);

/**
 * POST /api/admin/user-roles
 * @summary Add user role
 * @tags Admin
 */
router.post(
  "/user-roles",
  createUserRoleValidate,
  asyncMiddleware(adminController.createUserRole)
);

/**
 * PUT /api/admin/user-roles
 * @summary Update user role
 * @tags Admin
 */
router.put(
  "/user-roles",
  updateUserRoleValidate,
  asyncMiddleware(adminController.updateUserRole)
);

/**
 * DELETE /api/admin/user-roles
 * @summary Delete user role
 * @tags Admin
 */
router.delete(
  "/user-roles",
  deleteUserRoleValidate,
  asyncMiddleware(adminController.deleteUserRole)
);

module.exports = router;
