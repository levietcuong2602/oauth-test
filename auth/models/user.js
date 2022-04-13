const { STATUS_USER } = require('../constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      wallet_address: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM(Object.values(STATUS_USER)),
        allowNull: false,
        default: STATUS_USER.ACTIVE,
      },
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true,
    },
  );
  // eslint-disable-next-line no-unused-vars
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};
