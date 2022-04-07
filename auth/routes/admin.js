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
 * @route GET /clients/:clientId  get client
 */
router.get(
  "/clients/:clientId",
  asyncMiddleware(adminController.findClientById)
);

/**
 * @swagger
 * components:
 *   schemas:
 *     NewClient:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: the client's name.
 *           example: client A
 *         grants:
 *           type: array
 *           description: enum [client_credentials, authorization_code, refresh_token]
 *           example: [client_credentials, authorization_code, refresh_token]
 *         redirect_uris:
 *           type: array
 *           description: enum [client_credentials, authorization_code, refresh_token]
 *           example: ["http://localhost:3030/client/app"]
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: the number of client.
 *           example: 1
 *         client_id:
 *           type: string
 *           description: the client ID.
 *           example: 1362c15b16c62d63cae51b068dc7d0df83493749
 *         client_secret:
 *           type: string
 *           description: the client secret.
 *           example: a360274681c0ecc118ec7008973350ae419f27c9
 *         name:
 *           type: string
 *           description: the client's name.
 *           example: client A
 *         grants:
 *           type: array
 *           description: enum [client_credentials, authorization_code, refresh_token]
 *           example: [client_credentials, authorization_code, refresh_token]
 *         redirect_uris:
 *           type: array
 *           description: enum [client_credentials, authorization_code, refresh_token]
 *           example: ["http://localhost:3030/client/app"]
 */

/**
 * @swagger
 * /api/admin/clients:
 *   post:
 *     description: Create a client.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Client infomation.
 *         schema:
 *           $ref: '#/components/schemas/NewClient'
 *     responses:
 *       200:
 *         description: '{"code":200,"data":{"client_id":"1362c15b16c62d63cae51b068dc7d0df83493749","client_secret":"a360274681c0ecc118ec7008973350ae419f27c9","grants":"[\"authorization_code\"]","id":4,"name":"dd1","redirect_uris":"[\"http://localhost:3030/client/app\"]"},"status":1}'
 *       500:
 *         description: '{"code":500,"status":0,"message":"Client already exists with same name","data":null}'
 */
router.post(
  "/clients",
  createClientValidate,
  asyncMiddleware(adminController.createClient)
);

/**
 * @swagger
 * /api/admin/clients/{id}:
 *  put:
 *    description: Use to update client
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: numeric ID of the client to retrieve.
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: name
 *         required: false
 *         description: Name of client.
 *         schema:
 *           type: string
 *       - in: formData
 *         name: grants
 *         required: false
 *         description: grants
 *         schema:
 *           type: array
 *       - in: formData
 *         name: redirect_uris
 *         required: false
 *         description: redirect_uris
 *         schema:
 *           type: array
 *    responses:
 *      '200':
 *        description: '{"code":200,"data":{"client_id":"d7882478db52150ff935fe711e95ce0492771d87","client_secret":"b597f6fe0305425bba6f7e2fab0e2762500e8982","grants":["authorization_code"],"id":9,"name":"manh","redirect_uris":["http://localhost:3030/client/app"]},"status":1}'
 *      '500':
 *        description: '{"code":500,"status":0,"message":"Client does not exists","data":null}'
 */
router.put(
  "/clients/:client_id",
  updateClientValidate,
  asyncMiddleware(adminController.updateClient)
);

/**
 * @swagger
 * /api/admin/clients/{id}:
 *  delete:
 *    description: Use to update client
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the client to retrieve.
 *         schema:
 *           type: integer
 *    responses:
 *      '200':
 *        description: '{"code":200,"status":1}'
 */
router.delete(
  "/clients/:client_id",
  deleteClientValidate,
  asyncMiddleware(adminController.deleteClient)
);

/**
 * @route GET /users  CRUD user
 */

/**
 * @route PUT /users  CRUD user
 */

// api admin sso?
// entity role
/**
 * @route POST /roles  CRUD role
 */
router.post(
  "/roles",
  createRoleValidate,
  asyncMiddleware(adminController.createRole)
);

/**
 * @route PUT /roles  CRUD role
 */
router.put(
  "/roles/:role_id",
  updateRoleValidate,
  asyncMiddleware(adminController.updateRole)
);

/**
 * @route DELETE /roles  CRUD role
 */
router.delete(
  "/roles/:role_id",
  deleteRoleValidate,
  asyncMiddleware(adminController.deleteRole)
);

// entity user role
/**
 * @route POST /user-roles  CRUD role
 */
router.post(
  "/user-roles",
  createUserRoleValidate,
  asyncMiddleware(adminController.createUserRole)
);

/**
 * @route PUT /user-roles  CRUD role
 */
router.put(
  "/user-roles",
  updateUserRoleValidate,
  asyncMiddleware(adminController.updateUserRole)
);

/**
 * @route DELETE /user-roles  CRUD role
 */
router.delete(
  "/user-roles",
  deleteUserRoleValidate,
  asyncMiddleware(adminController.deleteUserRole)
);

module.exports = router;
