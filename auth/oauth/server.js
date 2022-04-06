const OAuthServer = require("express-oauth-server");
const model = require("./model");

const { AUTHORIZATION_CODE_LIFETIME } = require("../constants");

module.exports = new OAuthServer({
  model: model,
  grants: ["authorization_code", "refresh_token", "password"],
  accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
  // refreshTokenLifetime: "",
  authorizationCodeLifetime: AUTHORIZATION_CODE_LIFETIME, // default: 5 minutes
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
  useErrorHandler: true,
  debug: true,
});
