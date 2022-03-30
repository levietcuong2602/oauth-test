"use strict";
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      clientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      secretId: { type: DataTypes.STRING, allowNull: false },
      redirectUris: { type: DataTypes.STRING },
      grants: { type: DataTypes.STRING, allowNull: false },
    },
    {}
  );
  Client.associate = function (models) {
    // associations can be defined here
  };
  return Client;
};
