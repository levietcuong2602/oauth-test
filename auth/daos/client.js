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
  return client;
};

const updateClient = async (clientData) => {};

module.exports = { findClient, createClient, updateClient };
