"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client_id: { type: DataTypes.STRING, allowNull: false },
      role_id: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "user_roles",
      underscored: true,
      timestamps: false,
    }
  );
  UserRole.associate = function (models) {
    // associations can be defined here
    // UserRole.belongsTo(models.Client, {
    //   foreignKey: "client_id",
    // });
    // UserRole.belongsTo(models.User, {
    //   foreignKey: "user_id",
    // });
    // UserRole.belongsTo(models.Role, {
    //   foreignKey: "role_id",
    // });
  };
  return UserRole;
};
