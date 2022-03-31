const snakecaseKeys = require("snakecase-keys");

const { Token } = require("../models");

const findToken = async (condition) => {
  const token = await Token.findOne({
    where: snakecaseKeys(condition, { deep: true }),
    raw: true,
  });

  return token;
};

const saveToken = async (payload) => {
  let token = await Token.create(snakecaseKeys(payload, { deep: true }));
  return token.get({
    plain: true,
  });
};

module.exports = { findToken, saveToken };
