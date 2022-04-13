const snakecaseKeys = require("snakecase-keys");

const { UserRole, Client, Role } = require("../models");

const createUserRole = async (payload) => {
  const userRole = await UserRole.create(
    snakecaseKeys(payload, { deep: true }),
  );

  return userRole
    ? userRole.get({
        plain: true,
      })
    : null;
};

const updateUserRole = async ({ userId, clientId }, payload) => {
  await UserRole.update(snakecaseKeys(payload, { deep: true }), {
    where: {
      user_id: userId,
      client_id: clientId,
    },
  });
  const userRole = await UserRole.findOne({
    where: {
      user_id: userId,
      client_id: clientId,
    },
  });
  return userRole;
};

const deleteUserRole = async ({ userId, clientId }) => {
  await UserRole.destroy({
    where: {
      user_id: userId,
      client_id: clientId,
    },
  });
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
    raw: true,
    nest: true,
  });

  return userRoles;
};

const findUserRole = async (condition) => {
  const userRole = await UserRole.findOne({
    where: snakecaseKeys(condition, { deep: true }),
  });

  return userRole
    ? userRole.get({
        plain: true,
      })
    : null;
};

module.exports = {
  createUserRole,
  updateUserRole,
  deleteUserRole,
  getUserRoles,
  findUserRole,
};
