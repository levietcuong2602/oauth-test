"use strict";
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      accessToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accessTokenExpiresAt: { type: DataTypes.DATE, allowNull: false },
      clientId: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
    },
    {}
  );
  Token.associate = function (models) {
    // associations can be defined here
  };
  return Token;
};
