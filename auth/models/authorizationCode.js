"use strict";
module.exports = (sequelize, DataTypes) => {
  const AuthorizationCode = sequelize.define(
    "AuthorizationCode",
    {
      authorization_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      redirect_uri: { type: DataTypes.STRING, allowNull: true },
      client_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "authorization_codes",
      underscored: true,
      timestamps: false,
    }
  );
  AuthorizationCode.associate = function (models) {
    // associations can be defined here
    // AuthorizationCode.belongsTo(models.User);
  };
  return AuthorizationCode;
};
