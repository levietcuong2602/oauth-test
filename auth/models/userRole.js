module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'User',
          key: 'id',
        },
      },
      client_id: {
        type: DataTypes.STRING,
        allowNull: false.valueOf,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Client',
          key: 'id',
        },
      },
      role_id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    },
    {
      tableName: 'user_roles',
      underscored: true,
      timestamps: true,
    },
  );
  // eslint-disable-next-line no-unused-vars
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
