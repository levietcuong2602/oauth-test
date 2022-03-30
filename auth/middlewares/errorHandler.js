const statusCodes = require("../errors/code");
const getErrorMessage = require("../errors/message");
const { errorResponse } = require("../utilities/response");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.code;
  let { message } = err;
  const code = err.code || statusCodes.INTERNAL_SERVER_ERROR;
  switch (code) {
    case statusCodes.BAD_REQUEST:
      message = message || "Bad Request";
      break;
    case statusCodes.UNAUTHORIZED:
      message = "Unauthorized";
      break;
    case statusCodes.FORBIDDEN:
      message = "Forbidden";
      break;
    case statusCodes.NOT_FOUND:
      message = "Not Found";
      break;
    case statusCodes.INTERNAL_SERVER_ERROR:
      statusCode = statusCodes.INTERNAL_SERVER_ERROR;
      message = message || "Something went wrong";
      break;
    default:
      message = message || getErrorMessage(code);
      statusCode = 200;
  }
  return errorResponse({ req, res, statusCode, code });
};

module.exports = errorHandler;
