const express = require('express');

const router = express.Router(); // Instantiate a new router

const userDao = require('../../daos/user');
const { successResponse, errorResponse } = require('../../utilities/response');
const asyncMiddleware = require('../../middlewares/async');

const userAdminController = require('../../controllers/admin/user');

const { getUsersValidate } = require('../../validations/admin/user');

/**
 * GET /api/admin/users
 * @summary Get list users
 * @tags Admin
 */
router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await userDao.findUser({ id: userId });
  if (!user) return errorResponse({ req, res, statusCode: 500 });

  return successResponse(req, res, user);
});

/**
 * GET /api/admin/users
 * @summary Get list users
 * @tags Admin
 */
router.get(
  '/users',
  getUsersValidate,
  asyncMiddleware(userAdminController.getUsers),
);

/**
 * PUT /api/admin/users
 * @summary Update user info
 * @tags Admin
 */

module.exports = router;
