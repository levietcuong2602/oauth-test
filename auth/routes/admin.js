const path = require("path"); // has path and __dirname
const express = require("express");
var uuidv4 = require("uuid").v4;

const oauthServer = require("../oauth/server.js");
const userDao = require("../daos/user");
const clientDao = require("../daos/client");
const { successResponse, errorResponse } = require("../utilities/response");

const DebugControl = require("../utilities/debug.js");
const res = require("express/lib/response");

const router = express.Router(); // Instantiate a new router

router.get("/users/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const user = await userDao.findOneUser({ id: userId });
  if (!user) return errorResponse({ req, res, statusCode: 500 });

  return successResponse(req, res, user);
});

// authenticate user role admin sso adminAuthorize
router.post("/clients", async (req, res, next) => {
  DebugControl.log.flow("Create client");
  try {
    const { clientId, grants = [], redirectUris = [] } = req.body;
    const clientExists = await clientDao.findClient({ clientId });
    if (clientExists)
      throw new Error("Client already exists with same clientId");

    const data = {
      clientId,
      grants: JSON.stringify(grants),
      redirectUris: JSON.stringify(redirectUris),
      clientSecret: uuidv4(),
    };

    const newClient = await clientDao.createClient(data);
    return successResponse(req, res, newClient);
  } catch (err) {
    errorResponse({ req, res, message: err.message });
  }
});

module.exports = router;
