const adminService = require('../services/admin');

const DebugControl = require('../utilities/debug');
const { successResponse } = require('../utilities/response');

const createClient = async (req, res) => {
  DebugControl.log.flow('Create client');
  const {
    name,
    grants = [],
    redirect_uris: redirectUris = [],
    client_id: clientId,
    client_secret: clientSecret,
  } = req.body;

  const result = await adminService.createClient({
    name,
    grants,
    redirectUris,
    clientId,
    clientSecret,
  });
  return successResponse(req, res, result);
};

const updateClient = async (req, res) => {
  DebugControl.log.flow('Update client');
  const { id } = req.params;
  const { name, grants, redirect_uris: redirectUris } = req.body;

  const result = await adminService.updateClient(id, {
    name,
    grants,
    redirectUris,
  });
  return successResponse(req, res, result);
};

const deleteClient = async (req, res) => {
  DebugControl.log.flow('Delete client');
  const { id } = req.params;

  await adminService.deleteClient(id);
  return successResponse(req, res);
};

const findClientById = async (req, res) => {
  DebugControl.log.flow('Find client');
  const { id } = req.params;

  const client = await adminService.findClientById(id);
  if (client) {
    client.grants = JSON.parse(client.grants);
    client.redirect_uris = JSON.parse(client.redirect_uris);
  }
  return successResponse(req, res, client);
};

const createRole = async (req, res) => {
  DebugControl.log.flow('Create role');
  const { name, is_default: isDefault = false } = req.body;

  const result = await adminService.createRole({ name, isDefault });

  return successResponse(req, res, result);
};

const updateRole = async (req, res) => {
  DebugControl.log.flow('Update role');
  const { role_id: roleId } = req.params;
  const { name, is_default: isDefault } = req.body;

  const result = await adminService.updateRole(roleId, {
    name,
    isDefault,
  });
  return successResponse(req, res, result);
};

const deleteRole = async (req, res) => {
  DebugControl.log.flow('Delete role');
  const { role_id: roleId } = req.params;

  await adminService.deleteRole(roleId);
  return successResponse(req, res);
};

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
  createClient,
  updateClient,
  deleteClient,
  findClientById,
  createRole,
  updateRole,
  deleteRole,
  createUserRole,
  updateUserRole,
  deleteUserRole,
};
