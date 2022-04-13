const clientDao = require("../daos/client");
const roleDao = require("../daos/role");
const userDao = require("../daos/user");
const userRoleDao = require("../daos/userRole");
const errorCode = require("../errors/code");
const CustomError = require("../errors/CustomError");
const { omitIsNil } = require("../utilities/omit");
const { generateSecurityKey } = require("../utilities/security");

const createClient = async ({ name, grants = [], redirectUris = [] }) => {
  const clientExists = await clientDao.findClient({ name });
  if (clientExists) throw new Error("Client already exists with same name");

  const data = {
    name,
    grants: JSON.stringify(grants),
    redirectUris: JSON.stringify(redirectUris),
    clientId: generateSecurityKey(),
    clientSecret: generateSecurityKey(),
  };

  const newClient = await clientDao.createClient(data);
  return {
    ...newClient,
    grants: JSON.parse(newClient.grants),
    redirect_uris: JSON.parse(newClient.redirect_uris),
  };
};

const updateClient = async (id, clientData) => {
  const { name, grants, redirectUris } = clientData;
  const client = await clientDao.findClient({ id });

  if (!client) {
    throw new CustomError(errorCode.BAD_REQUEST, "Client does not exists");
  }

  if (name && client.name !== name) {
    const isClientNameExisted = await clientDao.findClient({ name });
    if (isClientNameExisted)
      throw new Error("Client already exists with same name");
  }

  const data = omitIsNil(
    {
      name,
      grants: JSON.stringify(grants),
      redirectUris: JSON.stringify(redirectUris),
    },
    { deep: false },
  );

  const newClient = await clientDao.updateClient(id, data);
  return {
    ...newClient,
    grants: JSON.parse(newClient.grants),
    redirect_uris: JSON.parse(newClient.redirect_uris),
  };
};

const deleteClient = async (id) => {
  const client = await clientDao.findClient({ id });

  if (!client) {
    throw new CustomError(errorCode.BAD_REQUEST, "Client does not exists");
  }

  await clientDao.deleteClient(id);
};

const findClientById = async (id) => {
  const client = await clientDao.findClient({ id });

  if (!client) {
    throw new CustomError(errorCode.NOT_FOUND, "Client does not exists");
  }

  return client;
};

const createRole = async ({ name, isDefault = false }) => {
  const roleExists = await roleDao.findRole({ name });
  if (roleExists) throw new Error("Role already exists with same name");

  const data = { name, isDefault };

  const newRole = await roleDao.createRole(data);
  return newRole;
};

const updateRole = async (roleId, roleData) => {
  const { name, isDefault } = roleData;

  const role = await roleDao.findRole({ id: roleId });

  if (!role) {
    throw new Error("Role does not exists");
  }

  if (name && role.name !== name) {
    const isRoleNameExisted = await roleDao.findRole({ name });
    if (isRoleNameExisted)
      throw new Error("Role already exists with same name");
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
    throw new Error("Role does not exists");
  }

  await roleDao.deleteRole(roleId);
};

const createUserRole = async ({ userId, clientId, roleId }) => {
  const user = await userDao.findUser({ id: userId });
  if (!user) {
    throw new Error("User does not exist");
  }

  const client = await clientDao.findClient({ id: clientId });
  if (!client) {
    throw new Error("Client does not exist");
  }

  const role = await roleDao.findRole({ id: roleId });
  if (!role) {
    throw new Error("Role does not exist");
  }

  const userRoles = await userRoleDao.getUserRoles({
    user_id: userId,
    client_id: clientId,
  });

  if (userRoles.length) {
    throw new Error("User role already exists");
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
    throw new Error("User does not exist");
  }

  const client = await clientDao.findClient({ id: clientId });
  if (!client) {
    throw new Error("Client does not exist");
  }

  const role = await roleDao.findRole({ id: roleId });
  if (!role) {
    throw new Error("Role does not exist");
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
    throw new Error("User does not exist");
  }

  const client = await clientDao.findClient({ id: clientId });
  if (!client) {
    throw new Error("Client does not exist");
  }

  const userRoles = await userRoleDao.getUserRoles({
    user_id: userId,
    client_id: clientId,
  });

  if (!userRoles.length) {
    throw new Error("User role does not exist");
  }

  await userRoleDao.deleteUserRole({ userId, clientId });
};

module.exports = {
  createClient,
  updateClient,
  deleteClient,
  findClientById,
  createRole,
  updateRole,
  deleteRole,
  createUserRole,
  updateUserRole,
  deleteUserRole,
};
