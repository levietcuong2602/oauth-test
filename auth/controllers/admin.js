const adminService = require("../services/admin");

const DebugControl = require("../utilities/debug.js");
const { successResponse } = require("../utilities/response");

const createClient = async (req, res) => {
  DebugControl.log.flow("Create client");
  const {
    client_id: clientId,
    grants = [],
    redirect_uris: redirectUris = [],
  } = req.body;

  const result = await adminService.createClient({
    clientId,
    grants,
    redirectUris,
  });
  return successResponse(req, res, result);
};

module.exports = { createClient };
