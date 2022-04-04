const snakecaseKeys = require("snakecase-keys");

const { UserRole } = require("../models");

const createUserRole = async (payload) => {
  const userRole = await UserRole.findOne({
    where: snakecaseKeys(payload, { deep: true }),
  });

  return userRole
    ? userRole.get({
        plain: true,
      })
    : null;
};

module.exports = { createUserRole };
