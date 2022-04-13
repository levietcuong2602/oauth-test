const errorCodes = require('./code');

function getErrorMessage(errorCode) {
  switch (errorCode) {
    case errorCodes.NOT_FOUND_MODEL:
      return 'No data found';
    default:
      return null;
  }
}

module.exports = getErrorMessage;
