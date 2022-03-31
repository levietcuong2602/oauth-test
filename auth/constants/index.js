const { TOKEN_TYPE } = require("./token");

const GRANT_TYPE = {
  CLIENT_CREDENTIAL: client_credentials,
  AUTHORIZATION_CODE: authorization_code,
};

module.exports = {
  TOKEN_TYPE,
  GRANT_TYPE,
};
