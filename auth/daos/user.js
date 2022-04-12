const snakecaseKeys = require("snakecase-keys");

const { User, sequelize } = require("../models");

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

const deleteUser = async (condition) => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await User.destroy({
    where: snakecaseKeys(condition, { deep: true }),
  });
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1"); // setting the flag back for security
};

const updateUser = async (userId, payload) => {
  await User.update(snakecaseKeys(payload, { deep: false }), {
    where: { id: userId },
  });
  const userUpdate = await findUser({
    id: userId,
  });
  return userUpdate;
};

module.exports = { findUser, createUser, deleteUser, updateUser };
