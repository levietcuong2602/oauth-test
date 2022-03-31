const snakecaseKeys = require("snakecase-keys");

const { AuthorizationCode } = require("../models");

const findAuthorizationCode = async (condition) => {
  const code = await AuthorizationCode.findOne(condition);
  return code;
};

const createAuthorizationCode = async (payload) => {
  const newCode = await AuthorizationCode.create(
    snakecaseKeys(payload, { deep: true })
  );
  return newCode;
};

module.exports = { findAuthorizationCode, createAuthorizationCode };
