const adminService = require("../services/admin");

const DebugControl = require("../utilities/debug.js");
const { successResponse } = require("../utilities/response");

const createClient = async (req, res) => {
  DebugControl.log.flow("Create client");
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
  DebugControl.log.flow("Update client");
  const { client_id: clientId } = req.params;
  const { name, grants = [], redirect_uris: redirectUris = [] } = req.body;

  const result = await adminService.updateClient(clientId, {
    name,
    grants,
    redirectUris,
  });
  return successResponse(req, res, result);
};

const deleteClient = async (req, res) => {
  DebugControl.log.flow("Delete client");
  const { client_id: clientId } = req.params;

  await adminService.deleteClient(clientId);
  return successResponse(req, res);
};

const findClientById = async (req, res) => {
  DebugControl.log.flow("Find client");
  const { clientId } = req.params;

  const client = await adminService.findClientById(clientId);
  if (client) {
    client.grants = JSON.parse(client.grants);
    client.redirect_uris = JSON.parse(client.redirect_uris);
  }
  return successResponse(req, res, client);
};

module.exports = { createClient, updateClient, deleteClient, findClientById };
