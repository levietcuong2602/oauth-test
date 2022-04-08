const snakecaseKeys = require("snakecase-keys");

const { User } = require("../models");

const findUser = async (condition) => {
  const user = await User.findOne({
    where: snakecaseKeys(condition, { deep: true }),
  });

  return user
    ? user.get({
        plain: true,
      })
    : null;
};

const createUser = async (payload) => {
  const newUser = await User.create(snakecaseKeys(payload, { deep: true }));
  return newUser.get({
    plain: true,
  });
};

module.exports = { findUser, createUser };
