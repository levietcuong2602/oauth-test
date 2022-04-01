const snakecaseKeys = require("snakecase-keys");

const { User } = require("../models");

const findUser = async (condition) => {
  const user = await User.findOne({
    where: snakecaseKeys(condition, { deep: true }),
    raw: true,
  });

  return user;
};

const createUser = async (payload) => {
  const newUser = await User.create(payload);
  return newUser.get({
    plain: true,
  });
};

module.exports = { findUser, createUser };
