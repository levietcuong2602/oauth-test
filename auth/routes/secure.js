const express = require('express');

const router = express.Router(); // Instantiate a new router
const DebugControl = require('../utilities/debug');
const { successResponse } = require('../utilities/response');

/**
 * GET /secure
 * @summary Check Access Protected Resources from Token
 * @tags User
 * @param {string} Authorization.header.required - Bearer token.
 * @return {object} 200 - success response
 * @example response - 200 - success response
 * {
 *    "code": 200,
 *    "data": "success",
 *    "status": 1
 * }
 */
router.get('/', (req, res) => {
  // Successfully reached if can hit this :)
  DebugControl.log.variable({
    name: 'res.locals.oauth.token',
    value: res.locals.oauth.token,
  });
  return successResponse(req, res, 'success');
});

module.exports = router;
