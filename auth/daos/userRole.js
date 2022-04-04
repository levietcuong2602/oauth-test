const snakecaseKeys = require("snakecase-keys");

const { UserRole, User, Client, Role } = require("../models");

const createUserRole = async (payload) => {
  const userRole = await UserRole.create(
    snakecaseKeys(payload, { deep: true })
  );

  return userRole
    ? userRole.get({
        plain: true,
      })
    : null;
};

const getUserRoles = async (condition) => {
  UserRole.belongsTo(Role);
  UserRole.belongsTo(Client);

  const userRoles = await UserRole.findAll({
    where: snakecaseKeys(condition, { deep: true }),
    include: [
      {
        model: Role,
        attributes: ["id", "name", "is_default"],
      },
      {
        model: Client,
        attributes: ["id", "client_id"],
      },
    ],
    attributes: ["user_id", "client_id", "role_id"],
  });

  return userRoles;
};

module.exports = { createUserRole, getUserRoles };
