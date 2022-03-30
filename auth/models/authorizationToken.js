"use strict";
module.exports = (sequelize, DataTypes) => {
  const AuthorizationCode = sequelize.define(
    "AuthorizationCode",
    {
      authorizationCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      redirectUri: { type: DataTypes.STRING, allowNull: false },
      clientId: { type: DataTypes.NUMBER, allowNull: false },
      userId: { type: DataTypes.NUMBER, allowNull: false },
    },
    {}
  );
  AuthorizationCode.associate = function (models) {
    // associations can be defined here
  };
  return AuthorizationCode;
};
