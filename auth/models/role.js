"use strict";
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      is_default: { type: DataTypes.BOOLEAN, default: false },
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
