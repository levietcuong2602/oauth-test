"use strict";
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      client_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "roles",
      underscored: true,
      timestamps: false,
    }
  );
  Role.associate = function (models) {
    // associations can be defined here
  };
  return Role;
};
