const path = require("path"); // has path and __dirname
const express = require("express");
const oauthServer = require("../oauth/server.js");
const userDao = require("../daos/user");
const { successResponse, errorResponse } = require("../utilities/response");

const DebugControl = require("../utilities/debug.js");
const res = require("express/lib/response");

const router = express.Router(); // Instantiate a new router

router.get("/users/:userId", async (req, res, next) => {
  const { userId } = req.params;
  console.log({ params: req.params });
  const user = await userDao.findOneUser({ id: userId });
  console.log(user);
  if (!user) return errorResponse({ req, res, statusCode: 500 });

  return successResponse(req, res, user);
});

// authenticate user role admin sso adminAutho
router.post("/clients", async (req, res, next) => {
  const { clientId, grants = [] } = req.body;
});

module.exports = router;
