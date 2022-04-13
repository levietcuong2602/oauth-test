const snakecaseKeys = require('snakecase-keys');

const { Role } = require('../models');

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

const createRole = async (payload) => {
  const role = await Role.create(snakecaseKeys(payload, { deep: true }));
  return role.get({
    plain: true,
  });
};

const updateRole = async (roleId, payload) => {
  await Role.update(snakecaseKeys(payload, { deep: true }), {
    where: {
      id: roleId,
    },
  });
  const role = await findRole({ id: roleId });
  return role;
};

const deleteRole = async (roleId) => {
  await Role.destroy({
    where: {
      id: roleId,
    },
  });
};

const getRoles = async () => {
  const roles = await Role.findAll({
    raw: true,
  });

  return roles;
};

module.exports = { findRole, createRole, updateRole, deleteRole, getRoles };
