const { TOKEN_TYPE, AUTHORIZATION_CODE_LIFETIME } = require('./token');
const { STATUS_USER } = require('./user');

const GRANT_TYPE = {
  CLIENT_CREDENTIAL: 'client_credentials',
  AUTHORIZATION_CODE: 'authorization_code',
  REFRESH_TOKEN: 'refresh_token',
  PASSWORD: 'password',
};

module.exports = {
  TOKEN_TYPE,
  GRANT_TYPE,
  AUTHORIZATION_CODE_LIFETIME: parseInt(AUTHORIZATION_CODE_LIFETIME, 10) || 300,
  STATUS_USER,
};
