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

module.exports = { createClient };
