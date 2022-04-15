const camelCaseKeys = require('camelcase-keys');

const adminService = require('../../services/admin/client');

const DebugControl = require('../../utilities/debug');
const { successResponse } = require('../../utilities/response');

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

const getClients = async (req, res) => {
  DebugControl.log.flow('Get clients');
  const data = await adminService.getClients(
    camelCaseKeys(req.query, { deep: true }),
  );
  return successResponse(req, res, data);
};

module.exports = {
  createClient,
  updateClient,
  deleteClient,
  findClientById,
  getClients,
};
