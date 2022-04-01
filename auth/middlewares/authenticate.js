const camelCase = require("camelcase-keys");

const statusCodes = require("../errors/code");
const { verifyToken } = require("../utilities/auth");
const { SECRET_REFRESH } = require("../config");

// Trước khi đi vào controllers request sẽ đi qua một trong các hàm dưới đây
// tùy vào việc được khai báo ở route
async function authenticate(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error();
    const [tokenType, accessToken] = authorization.split(" ");
    if (tokenType !== "Bearer") throw new Error();
    const data = await verifyAccessToken(accessToken);
    const { userId, iat, exp } = camelCase(data, { deep: true });
    if (!userId || iat > exp) {
      throw new Error();
    }
    req.userId = userId;
    return next();
  } catch (error) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .send({ status: 0, message: "Unauthorized" });
  }
}

const authenticateRefresh = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error();

    const [tokenType, refreshToken] = authorization.split(" ");
    if (tokenType !== "Bearer") throw new Error();

    const data = await verifyToken(refreshToken, SECRET_REFRESH);
    const { user, client, iat, exp } = camelCase(data, { deep: true });
    if (!user || !client || iat > exp) {
      throw new Error();
    }
    req.user = user;
    req.client = client;
    return next();
  } catch (error) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .send({ status: 0, message: "Unauthorized" });
  }
};

async function authorize(req, res, next) {
  next();
}

module.exports = { authenticate, authenticateRefresh, authorize };
