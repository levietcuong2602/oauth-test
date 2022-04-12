const camelCase = require("camelcase-keys");

const { SECRET_REFRESH } = require("../config");

const statusCodes = require("../errors/code");
const { verifyToken } = require("../utilities/auth");
const { errorResponse } = require("../utilities/response");
const DebugControl = require("../utilities/debug");
const { compareBcrypt } = require("../utilities/bcrypt");
const { decrypt, hashSHA512 } = require("../utilities/security");

const userDao = require("../daos/user");
const clientDao = require("../daos/client");

const authenticationLogin = async (req, res, next) => {
  try {
    DebugControl.log.flow("Initial User Authentication");
    const { username, password, client_id } = req.body;
    // check username exists
    const user = await userDao.findUser({ username });
    if (!user) throw new Error("User not found");

    // check clientId exists
    const client = await clientDao.findClient({ client_id });
    if (!client) throw new Error("Client not found");

    // check password
    const isCorrectPassword = await compareBcrypt(
      hashSHA512(password),
      decrypt(user.password),
    );
    if (!isCorrectPassword) throw new Error("Password incorrect");

    req.body.user = user;
    req.body.client = client;
    return next();
  } catch (err) {
    // const params = [
    //   // Send params back down
    //   "client_id",
    //   "redirect_uri",
    //   "response_type",
    //   "grant_type",
    //   "state",
    // ]
    //   .map((a) => `${a}=${req.body[a]}`)
    //   .join("&");
    // return res.redirect(`/oauth?success=false&${params}`);
    return errorResponse({
      req,
      res,
      message: err.message,
      statusCode: statusCodes.UNAUTHORIZED,
      code: statusCodes.UNAUTHORIZED,
    });
  }
};

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

module.exports = {
  authenticationLogin,
  authenticateRefresh,
  authorize,
};
