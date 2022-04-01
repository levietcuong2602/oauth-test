const successResponse = (req, res, data, code = 200) =>
  res.send({
    code,
    data,
    status: 1,
  });

const errorResponse = ({
  req,
  res,
  statusCode = 500,
  code = 500,
  message = "Something went wrong",
  details,
}) =>
  res.status(statusCode).json({
    code,
    status: 0,
    message,
    data: null,
    details,
  });

module.exports = { successResponse, errorResponse };
