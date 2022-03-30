const snakecaseKeys = require("snakecase-keys");

const { Client } = require("../models");

const findOneClient = async (condition) => {
  const client = await Client.findOne({
    where: snakecaseKeys(condition, { deep: true }),
    raw: true,
  });

  return client;
};

const createClient = async (clientData) => {};

const updateClient = async (clientData) => {};

module.exports = { findOneClient, createClient, updateClient };
