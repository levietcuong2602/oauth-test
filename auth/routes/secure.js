const express = require("express");
const router = express.Router(); // Instantiate a new router
const DebugControl = require("../utilities/debug.js");
const { successResponse } = require("../utilities/response");

/**
 * @swagger
 * /secure:
 *   get:
 *     description: Check Access Protected Resources from Token
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: this is access token
 *         schema:
 *           type: string
 *         example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W3sicm9sZUlkIjozLCJjbGllbnRJZCI6ImYzZTBmODEyMzg1YjdhMjFhMDc1ZDA0NzY3MDI1NGUyMWViMDU5MTQiLCJyb2xlTmFtZSI6InVzZXIifV0sImNsaWVudCI6eyJpZCI6MSwibmFtZSI6Im1hcmtldHBsYWNlIiwiY2xpZW50SWQiOiJmM2UwZjgxMjM4NWI3YTIxYTA3NWQwNDc2NzAyNTRlMjFlYjA1OTE0IiwiY2xpZW50U2VjcmV0IjoiNzE3NzU3NjRkN2NiZDAxYTJhOWMyMmE5ODcwMjZiYzRkYTkzNzBiNSIsInJlZGlyZWN0VXJpcyI6WyJodHRwOi8vbG9jYWxob3N0OjMwMzAvY2xpZW50L2FwcCJdLCJncmFudHMiOlsiYXV0aG9yaXphdGlvbl9jb2RlIiwicmVmcmVzaF90b2tlbiIsInBhc3N3b3JkIl19LCJ1c2VyIjp7ImlkIjoxMCwidXNlcm5hbWUiOiJjdW9uZ2x2QGdtYWlsLmNvbSJ9LCJpYXQiOjE2NDkzMjUwNzMsImV4cCI6MTY0OTMyNTA3NH0.ZMUYylsRVgm36c_v5F_58M4tr81uDAS22gRDNCFVk0c
 *     responses:
 *       200:
 *         description: '{"code":200,"data":"success","status":1}'
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
