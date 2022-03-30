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
}) =>
  res.status(statusCode).json({
    code,
    message,
    data: null,
    status: 0,
  });

module.exports = { successResponse, errorResponse };
