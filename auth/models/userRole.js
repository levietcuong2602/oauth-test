"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientId: { type: DataTypes.STRING, allowNull: false },
      roleId: { type: DataTypes.STRING, allowNull: false },
    },
    {}
  );
  UserRole.associate = function (models) {
    // associations can be defined here
  };
  return UserRole;
};
