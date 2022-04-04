const camelcaseKeys = require("camelcase-keys");

const userRoleDao = require("../daos/userRole");

const getRoleUserInClients = async (userId) => {
  // return list role in all clients
  let listRoleUsers = await userRoleDao.getUserRoles({ userId });
  let roles = listRoleUsers
    ? camelcaseKeys(JSON.parse(JSON.stringify(listRoleUsers)), { deep: true })
    : [];
  roles = roles.map((item) => ({
    roleId: item.roleId,
    clientId: item.client.clientId,
    roleName: item.role.name,
  }));

  return roles;
};

module.exports = { getRoleUserInClients };
