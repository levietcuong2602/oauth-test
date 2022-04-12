const camelcaseKeys = require("camelcase-keys");

const userRoleDao = require("../daos/userRole");

const getRoleUserInClients = async (userId) => {
  // return list role in all clients
  const listRoleUsers = await userRoleDao.getUserRoles({ userId });
  const roles = listRoleUsers
    ? camelcaseKeys(listRoleUsers, { deep: true })
    : [];
  return roles;
};

module.exports = { getRoleUserInClients };
