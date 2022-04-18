const express = require('express');

const router = express.Router(); // Instantiate a new router

const asyncMiddleware = require('../../middlewares/async');

const {
  createClientValidate,
  updateClientValidate,
  deleteClientValidate,
  getClientsValidate,
} = require('../../validations/admin/client');
const adminController = require('../../controllers/admin/client');

/**
 * NewClient
 * @typedef {object} NewClient
 * @property {string} name.required - The client's name
 * @property {array<string>} grants.required - Grant
 * @property {array<string>} redirect_uris.required - Redirect_uris
 */

/**
 * GET /api/admin/clients/{id}
 * @summary Get client by ID
 * @tags Admin
 * @param {string} id.path.required - Identify ID of client
 * @return {object} 200 - success response
 * @return {object} 404 - not found client
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
 * @example response - 404 - not found client
 * {
 *   "code": 404,
 *   "status": 0,
 *   "message": "Not Found",
 *   "data": null
 * }
 */
router.get('/clients/:id', asyncMiddleware(adminController.findClientById));

/**
 * POST /api/admin/clients
 * @summary Create a client
 * @tags Admin
 * @param {NewClient} request.body.required
 * @return {object} 200 - success response
 * @return {object} 400 - bad request
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
 * @example response - 400 - validation failed
 * {
 *     "code": 400,
 *     "status": 0,
 *     "message": "Validation Failed",
 *     "data": null,
 *     "details": [
 *         {
 *             "name": "\"name\" is required"
 *         }
 *     ]
 * }
 */
router.post(
  '/clients',
  createClientValidate,
  asyncMiddleware(adminController.createClient),
);

/**
 * PUT /api/admin/clients/{id}
 * @summary Update a client
 * @tags Admin
 * @param {string} id.path.required - Identify ID of client
 * @param {NewClient} request.body.required - Name of client
 * @return {object} 200 - success response
 * @return {object} 400 - bad request
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
 * @example response - 400 - client does not exist
 * {
 *   "code": 400,
 *   "status": 0,
 *   "message": "Client does not exists",
 *   "data": null
 * }
 */
router.put(
  '/clients/:id',
  updateClientValidate,
  asyncMiddleware(adminController.updateClient),
);

/**
 * DELETE /api/admin/clients/{id}
 * @summary Delete a client
 * @tags Admin
 * @param {string} id.path.required - Identify ID of client
 * @return {object} 200 - success response
 * @return {object} 400 - client does not exist
 * @example response - 200 - success response
 * {
 *   "code": 200,
 *   "status": 1
 * }
 * @example response - 400 - client does not exist
 * {
 *   "code": 400,
 *   "status": 0,
 *   "message": "Client does not exists",
 *   "data": null
 * }
 */
router.delete(
  '/clients/:id',
  deleteClientValidate,
  asyncMiddleware(adminController.deleteClient),
);

/**
 * GET /api/admin/clients
 * @summary Get list clients
 * @tags Admin
 */
router.get(
  '/clients',
  getClientsValidate,
  asyncMiddleware(adminController.getClients),
);

module.exports = router;
