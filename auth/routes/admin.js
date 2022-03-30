const path = require("path"); // has path and __dirname
const express = require("express");
const oauthServer = require("../oauth/server.js");
const { User } = require("../models");
const { successResponse } = require("../utilities/response");

const DebugControl = require("../utilities/debug.js");
const res = require("express/lib/response");

const router = express.Router(); // Instantiate a new router

router.get("/users/:userId", async (req, res) => {
  const user = await User.findOne();
  if (!user) throw Error();

  return successResponse(req, res, user);
});

module.exports = router;
