const snakecaseKeys = require("snakecase-keys");

const { Role } = require("../models");

const findRole = async (condition) => {
  const role = await Role.findOne({
    where: snakecaseKeys(condition, { deep: true }),
  });

  return role
    ? role.get({
        plain: true,
      })
    : null;
};

module.exports = { findRole };
