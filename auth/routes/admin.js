const path = require("path"); // has path and __dirname
const express = require("express");
const oauthServer = require("../oauth/server.js");
const { User } = require("../models");

const DebugControl = require("../utilities/debug.js");
const res = require("express/lib/response");

const router = express.Router(); // Instantiate a new router

router.get("/users", (req, res) => {
  // create users in sso
});

module.exports = router;
