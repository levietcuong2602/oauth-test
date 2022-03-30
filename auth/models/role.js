"use strict";
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      clientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      redirectUris: { type: DataTypes.STRING },
      grants: { type: DataTypes.STRING, allowNull: false },
    },
    {}
  );
  Role.associate = function (models) {
    // associations can be defined here
  };
  return Role;
};
