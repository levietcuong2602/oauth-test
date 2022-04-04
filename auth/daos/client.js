const snakecaseKeys = require("snakecase-keys");

const { Client } = require("../models");

const findClient = async (condition) => {
  const client = await Client.findOne({
    where: snakecaseKeys(condition, { deep: true }),
    raw: true,
  });

  return client;
};

const createClient = async (payload) => {
  const client = await Client.create(snakecaseKeys(payload, { deep: true }));
  return client.get({
    plain: true,
  });
};

const updateClient = async (clientId, payload) => {
  await Client.update(snakecaseKeys(payload, { deep: true }), {
    where: {
      client_id: clientId,
    },
  });
  const client = await findClient({ client_id: clientId });
  return client;
};

const deleteClient = async (clientId) => {
  await Client.destroy({
    where: {
      client_id: clientId,
    },
  });
};

module.exports = { findClient, createClient, updateClient, deleteClient };
