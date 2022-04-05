const express = require("express");
const router = express.Router(); // Instantiate a new router
const DebugControl = require("../utilities/debug.js");
const { successResponse } = require("../utilities/response");

/**
 * verify access token
 * @route POST /secure/ get access & refresh token
 * @param {string} authorization_code.required - username or email - eg: user@domain
 * @param {string} client_id.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get("/", (req, res) => {
  // Successfully reached if can hit this :)
  DebugControl.log.variable({
    name: "res.locals.oauth.token",
    value: res.locals.oauth.token,
  });
  return successResponse(req, res, "success");
});

module.exports = router;
