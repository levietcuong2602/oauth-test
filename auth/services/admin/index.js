const clientDao = require('../../daos/client');
const roleDao = require('../../daos/role');
const userDao = require('../../daos/user');
const userRoleDao = require('../../daos/userRole');

const createUserRole = async ({ userId, clientId, roleId }) => {
  const user = await userDao.findUser({ id: userId });
  if (!user) {
    throw new Error('User does not exist');
  }

  const client = await clientDao.findClient({ id: clientId });
  if (!client) {
    throw new Error('Client does not exist');
  }

  const role = await roleDao.findRole({ id: roleId });
  if (!role) {
    throw new Error('Role does not exist');
  }

  const userRoles = await userRoleDao.getUserRoles({
    user_id: userId,
    client_id: clientId,
  });

  if (userRoles.length) {
    throw new Error('User role already exists');
  }
  const data = {
    userId,
    clientId,
    roleId,
  };

  const newUserRole = await userRoleDao.createUserRole(data);
  return newUserRole;
};

const updateUserRole = async ({ userId, clientId }, { roleId }) => {
  const user = await userDao.findUser({ id: userId });
  if (!user) {
    throw new Error('User does not exist');
  }

  const client = await clientDao.findClient({ id: clientId });
  if (!client) {
    throw new Error('Client does not exist');
  }

  const role = await roleDao.findRole({ id: roleId });
  if (!role) {
    throw new Error('Role does not exist');
  }

  const newUserRole = await userRoleDao.updateUserRole(
    { userId, clientId },
    { roleId },
  );
  return newUserRole;
};

const deleteUserRole = async ({ userId, clientId }) => {
  const user = await userDao.findUser({ id: userId });
  if (!user) {
    throw new Error('User does not exist');
  }

  const client = await clientDao.findClient({ id: clientId });
  if (!client) {
    throw new Error('Client does not exist');
  }

  const userRoles = await userRoleDao.getUserRoles({
    user_id: userId,
    client_id: clientId,
  });

  if (!userRoles.length) {
    throw new Error('User role does not exist');
  }

  await userRoleDao.deleteUserRole({ userId, clientId });
};

module.exports = {
  createUserRole,
  updateUserRole,
  deleteUserRole,
};
