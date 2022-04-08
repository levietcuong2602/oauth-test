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

const updateClient = async (id, payload) => {
  await Client.update(snakecaseKeys(payload, { deep: true }), {
    where: { id },
  });
  const client = await findClient({ id });
  return client;
};

const deleteClient = async (id) => {
  await Client.destroy({
    where: { id },
  });
};

module.exports = { findClient, createClient, updateClient, deleteClient };
