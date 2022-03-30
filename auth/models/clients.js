"use strict";
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      client_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client_secret: { type: DataTypes.STRING, allowNull: false },
      redirect_uris: { type: DataTypes.STRING },
      grants: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "clients",
      underscored: true,
      timestamps: false,
    }
  );
  Client.associate = function (models) {
    // associations can be defined here
  };
  return Client;
};
