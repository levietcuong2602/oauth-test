const jwt = require('jsonwebtoken');

const verifyToken = async (token, secretKey) => {
  const data = await jwt.verify(token, secretKey);
  return data;
};

const generateToken = async (payload, secretKey, options) => {
  const token = jwt.sign(payload, secretKey, options);
  return token;
};

module.exports = { verifyToken, generateToken };
