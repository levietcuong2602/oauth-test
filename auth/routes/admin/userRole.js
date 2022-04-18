const express = require('express');

const router = express.Router(); // Instantiate a new router

const asyncMiddleware = require('../../middlewares/async');

const {
  createUserRoleValidate,
  updateUserRoleValidate,
  deleteUserRoleValidate,
} = require('../../validations/admin/userRole');
const userRoleAdminController = require('../../controllers/admin/userRole');

/**
 * POST /api/admin/user-roles
 * @summary Add user role
 * @tags Admin
 */
router.post(
  '/user-roles',
  createUserRoleValidate,
  asyncMiddleware(userRoleAdminController.createUserRole),
);

/**
 * PUT /api/admin/user-roles
 * @summary Update user role
 * @tags Admin
 */
router.put(
  '/user-roles',
  updateUserRoleValidate,
  asyncMiddleware(userRoleAdminController.updateUserRole),
);

/**
 * DELETE /api/admin/user-roles
 * @summary Delete user role
 * @tags Admin
 */
router.delete(
  '/user-roles',
  deleteUserRoleValidate,
  asyncMiddleware(userRoleAdminController.deleteUserRole),
);

module.exports = router;
