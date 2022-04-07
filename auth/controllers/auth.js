const authService = require("../services/auth");
const { successResponse } = require("../utilities/response");
const DebugControl = require("../utilities/debug.js");

const registerAccount = async (req, res) => {
  DebugControl.log.flow("Register User");
  const { username, password, client_id } = req.body;

  const data = await authService.registerAccount({
    username,
    password,
    client_id,
  });
  return successResponse(req, res, data);
};

const getAuthorizationTokenByMobile = async (req, res) => {
  DebugControl.log.flow("Authenticate Handler Mobile");
  const {
    client: { id: clientId },
    user: { id: userId },
  } = req.body;
  const data = await authService.getAuthorizationTokenByMobile({
    userId,
    clientId,
  });
  return successResponse(req, res, data);
};

module.exports = { registerAccount, getAuthorizationTokenByMobile };
