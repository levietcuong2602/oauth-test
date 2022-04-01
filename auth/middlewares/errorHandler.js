const statusCodes = require("../errors/code");
const getErrorMessage = require("../errors/message");
const { errorResponse } = require("../utilities/response");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.code || err.statusCode;
  let details;
  let { message } = err;
  const code = err.code || err.statusCode || statusCodes.INTERNAL_SERVER_ERROR;
  console.log({ errorHandler: message, code });
  switch (code) {
    case statusCodes.BAD_REQUEST:
      message = message || "Bad Request";
      details = err.details;
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

  return errorResponse({ req, res, statusCode, code, message, details });
};

module.exports = errorHandler;
