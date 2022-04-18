const express = require('express');

const router = express.Router(); // Instantiate a new router

const asyncMiddleware = require('../../middlewares/async');

const {
  createRoleValidate,
  updateRoleValidate,
  deleteRoleValidate,
  getRolesValidate,
} = require('../../validations/admin/role');
const roleAdminController = require('../../controllers/admin/role');

/**
 * GET /api/admin/roles
 * @summary Get role
 * @tags Admin
 */
router.get(
  '/roles',
  getRolesValidate,
  asyncMiddleware(roleAdminController.getRoles),
);

/**
 * POST /api/admin/roles
 * @summary Create role
 * @tags Admin
 */
router.post(
  '/roles',
  createRoleValidate,
  asyncMiddleware(roleAdminController.createRole),
);

/**
 * PUT /api/admin/roles
 * @summary Update role
 * @tags Admin
 */
router.put(
  '/roles/:role_id',
  updateRoleValidate,
  asyncMiddleware(roleAdminController.updateRole),
);

/**
 * DELETE /api/admin/roles
 * @summary Delete role
 * @tags Admin
 */
router.delete(
  '/roles/:role_id',
  deleteRoleValidate,
  asyncMiddleware(roleAdminController.deleteRole),
);

module.exports = router;
