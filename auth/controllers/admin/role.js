const camelCaseKeys = require('camelcase-keys');

const roleAdminService = require('../../services/admin/role');

const DebugControl = require('../../utilities/debug');
const { successResponse } = require('../../utilities/response');

const createRole = async (req, res) => {
  DebugControl.log.flow('Create role');
  const { name, is_default: isDefault = false } = req.body;

  const result = await roleAdminService.createRole({ name, isDefault });

  return successResponse(req, res, result);
};

const updateRole = async (req, res) => {
  DebugControl.log.flow('Update role');
  const { role_id: roleId } = req.params;
  const { name, is_default: isDefault } = req.body;

  const result = await roleAdminService.updateRole(roleId, {
    name,
    isDefault,
  });
  return successResponse(req, res, result);
};

const deleteRole = async (req, res) => {
  DebugControl.log.flow('Delete role');
  const { role_id: roleId } = req.params;

  await roleAdminService.deleteRole(roleId);
  return successResponse(req, res);
};

const getRoles = async (req, res) => {
  DebugControl.log.flow('Get roles');
  const data = await roleAdminService.getRoles(
    camelCaseKeys(req.query, { deep: true }),
  );
  return successResponse(req, res, data);
};

module.exports = { createRole, updateRole, deleteRole, getRoles };
