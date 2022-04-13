const snakecaseKeys = require("snakecase-keys");

const { Token, User, Client } = require("../models");

const findToken = async (condition) => {
  Token.belongsTo(User);
  Token.belongsTo(Client);

  const token = await Token.findOne({
    where: snakecaseKeys(condition, { deep: true }),
    include: [
      {
        model: User,
        attributes: ["id", "username", "wallet_address"],
      },
      {
        model: Client,
        attributes: ["id", "client_id", "client_secret"],
      },
    ],
  });

  return token
    ? token.get({
        plain: true,
      })
    : null;
};

const saveToken = async (payload) => {
  const token = await Token.create(snakecaseKeys(payload, { deep: true }));
  return token.get({
    plain: true,
  });
};

module.exports = { findToken, saveToken };
