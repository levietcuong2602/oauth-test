const express = require("express");
const router = express.Router(); // Instantiate a new router
const DebugControl = require("../utilities/debug.js");
const { successResponse } = require("../utilities/response");

/**
 * @swagger
 * /secure:
 *   get:
 *     description: Get access & refresh token
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
