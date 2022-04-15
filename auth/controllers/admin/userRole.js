const adminService = require('../../services/admin');

const DebugControl = require('../../utilities/debug');
const { successResponse } = require('../../utilities/response');

const createUserRole = async (req, res) => {
  DebugControl.log.flow('Create user role');
  const { user_id: userId, client_id: clientId, role_id: roleId } = req.body;

  const result = await adminService.createUserRole({
    userId,
    clientId,
    roleId,
  });

  return successResponse(req, res, result);
};

const updateUserRole = async (req, res) => {
  DebugControl.log.flow('Update user role');

  const { user_id: userId, client_id: clientId } = req.query;
  const { role_id: roleId } = req.body;

  const result = await adminService.updateUserRole(
    { userId, clientId },
    {
      roleId,
    },
  );

  return successResponse(req, res, result);
};

const deleteUserRole = async (req, res) => {
  DebugControl.log.flow('Delete user role');
  const { user_id: userId, client_id: clientId } = req.query;

  await adminService.deleteUserRole({ userId, clientId });
  return successResponse(req, res);
};

module.exports = {
  createUserRole,
  updateUserRole,
  deleteUserRole,
};
