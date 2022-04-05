const clientDao = require("../daos/client");
const roleDao = require("../daos/role");
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
  return newClient;
};

const updateClient = async (clientId, clientData) => {
  const { name, grants, redirectUris } = clientData;
  const client = await clientDao.findClient({ clientId });

  if (!client) {
    throw new Error("Client does not exists");
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
    { deep: false }
  );

  const newClient = await clientDao.updateClient(clientId, data);
  return newClient;
};

const deleteClient = async (clientId) => {
  const client = await clientDao.findClient({ clientId });

  if (!client) {
    throw new Error("Client does not exists");
  }

  await clientDao.deleteClient(clientId);
};

const findClientById = async (clientId) => {
  const client = await clientDao.findClient({ id: clientId });
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
    { deep: false }
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

module.exports = {
  createClient,
  updateClient,
  deleteClient,
  findClientById,
  createRole,
  updateRole,
  deleteRole,
};
