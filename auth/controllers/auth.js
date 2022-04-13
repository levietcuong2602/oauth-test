const authService = require("../services/auth");

const { successResponse } = require("../utilities/response");
const DebugControl = require("../utilities/debug");
const { verifyToken } = require("../utilities/auth");

const { SECRET_TOKEN } = require("../config");

const CustomError = require("../errors/CustomError");
const statusCode = require("../errors/code");

const registerAccount = async (req, res) => {
  DebugControl.log.flow("Register User");
  const { username, password, client_id: clientId } = req.body;

  const data = await authService.registerAccount({
    username,
    password,
    clientId,
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

const generateNonceSession = async (req, res) => {
  DebugControl.log.flow("Generate Nonce Session");
  const { client_id: clientId, wallet_address: walletAddress } = req.body;
  const data = await authService.generateNonceSession({
    walletAddress,
    clientId,
  });
  return successResponse(req, res, data);
};

const verifySignature = async (req, res) => {
  DebugControl.log.flow("Verify Signature");
  const {
    session_id: sessionId,
    client_id: clientId,
    wallet_address: walletAddress,
    signature,
  } = req.body;

  const data = await authService.verifySignature({
    walletAddress,
    clientId,
    sessionId,
    signature,
  });
  return successResponse(req, res, data);
};

const combineAccountAndWallet = async (req, res) => {
  const { account_token: accountToken, wallet_token: walletToken } = req.body;
  try {
    const accountData = await verifyToken(accountToken, SECRET_TOKEN);
    const walletData = await verifyToken(walletToken, SECRET_TOKEN);
    const data = await authService.combineAccountAndWallet({
      accountId: accountData.user.id,
      walletId: walletData.user.id,
    });
    return successResponse(req, res, data);
  } catch (error) {
    throw new CustomError(statusCode.BAD_REQUEST, error.message);
  }
};

module.exports = {
  registerAccount,
  getAuthorizationTokenByMobile,
  generateNonceSession,
  verifySignature,
  combineAccountAndWallet,
};
