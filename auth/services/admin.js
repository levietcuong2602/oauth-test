const clientDao = require("../daos/client");
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
  const { name, grants = [], redirectUris = [] } = clientData;
  const client = await clientDao.findClient({ clientId });

  if (!client) {
    throw new Error("Client does not exists");
  }

  if (client.name !== name) {
    const isClientNameExisted = await clientDao.findClient({ name });
    if (isClientNameExisted)
      throw new Error("Client already exists with same name");
  }

  const data = {
    name,
    grants: JSON.stringify(grants),
    redirectUris: JSON.stringify(redirectUris),
  };

  const newClient = await clientDao.updateClient(clientId, data);
  return newClient;
};

const deleteClient = async (clientId) => {
  console.log({ clientId });
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

module.exports = { createClient, updateClient, deleteClient, findClientById };
