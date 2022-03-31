const snakecaseKeys = require("snakecase-keys");

const { AuthorizationCode, User, Client } = require("../models");

const findAuthorizationCode = async (condition) => {
  AuthorizationCode.belongsTo(User);
  AuthorizationCode.belongsTo(Client);
  User.hasMany(AuthorizationCode);

  const code = await AuthorizationCode.findOne({
    where: snakecaseKeys(condition, { deep: true }),
    include: [
      { model: User, attribute: ["id", "username", "wallet_address"] },
      { model: Client },
    ],
    limit: 1,
  });

  return code.get({
    plain: true,
  });
};

const createAuthorizationCode = async (payload) => {
  const newCode = await AuthorizationCode.create(
    snakecaseKeys(payload, { deep: true })
  );
  return newCode.get({
    plain: true,
  });
};

const deleteAuthorizationCode = async (condition) => {
  const deleteResult = await AuthorizationCode.destroy({
    where: snakecaseKeys(condition, { deep: true }),
  });
  return deleteResult;
};

module.exports = {
  findAuthorizationCode,
  createAuthorizationCode,
  deleteAuthorizationCode,
};
