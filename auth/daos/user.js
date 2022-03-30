const snakecaseKeys = require("snakecase-keys");

const { User } = require("../models");

const findOneUser = async (condition) => {
  const user = await User.findOne({
    where: snakecaseKeys(condition, { deep: true }),
    raw: true,
  });

  return user;
};

const createUser = async (userData) => {};

const updateUser = async (userId, dataUpdate) => {};

module.exports = { findOneUser, createUser, updateUser };
