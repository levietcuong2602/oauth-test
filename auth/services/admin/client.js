const clientDao = require('../../daos/client');
const { omitIsNil } = require('../../utilities/omit');
const { generateSecurityKey } = require('../../utilities/security');
const errorCode = require('../../errors/code');
const CustomError = require('../../errors/CustomError');

const getClients = async ({ limit, pageNum, ...condition }) => {
  const roles = await clientDao.getClients({
    ...condition,
    limit: parseInt(limit, 10) || 10,
    pageNum: parseInt(pageNum, 10) > 0 ? +pageNum : 1,
  });

  return roles;
};

const findClientById = async (id) => {
  const client = await clientDao.findClient({ id });

  if (!client)
    throw new CustomError(errorCode.NOT_FOUND, 'Client does not exists');

  return client;
};

const createClient = async ({ name, grants = [], redirectUris = [] }) => {
  const clientExists = await clientDao.findClient({ name });
  if (clientExists) throw new Error('Client already exists with same name');

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
    throw new CustomError(errorCode.BAD_REQUEST, 'Client does not exists');
  }

  if (name && client.name !== name) {
    const isClientNameExisted = await clientDao.findClient({ name });
    if (isClientNameExisted)
      throw new Error('Client already exists with same name');
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
    throw new CustomError(errorCode.BAD_REQUEST, 'Client does not exists');
  }

  await clientDao.deleteClient(id);
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  findClientById,
};
