const roleDao = require('../../daos/role');

const { omitIsNil } = require('../../utilities/omit');

const getRoles = async ({ limit, pageNum, ...condition }) => {
  const roles = await roleDao.getRoles({
    ...condition,
    limit: parseInt(limit, 10) || 10,
    pageNum: parseInt(pageNum, 10) > 0 ? +pageNum : 1,
  });

  return roles;
};

const createRole = async ({ name, isDefault = false }) => {
  const roleExists = await roleDao.findRole({ name });
  if (roleExists) throw new Error('Role already exists with same name');

  const data = { name, isDefault };

  const newRole = await roleDao.createRole(data);
  return newRole;
};

const updateRole = async (roleId, roleData) => {
  const { name, isDefault } = roleData;

  const role = await roleDao.findRole({ id: roleId });

  if (!role) {
    throw new Error('Role does not exists');
  }

  if (name && role.name !== name) {
    const isRoleNameExisted = await roleDao.findRole({ name });
    if (isRoleNameExisted)
      throw new Error('Role already exists with same name');
  }

  const data = omitIsNil(
    {
      name,
      isDefault,
    },
    { deep: false },
  );

  const newRole = await roleDao.updateRole(roleId, data);
  return newRole;
};

const deleteRole = async (roleId) => {
  const role = await roleDao.findRole({ id: roleId });

  if (!role) {
    throw new Error('Role does not exists');
  }

  await roleDao.deleteRole(roleId);
};

module.exports = { getRoles, createRole, updateRole, deleteRole };
