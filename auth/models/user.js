module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      },
      wallet_address: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "users",
      underscored: true,
      timestamps: false,
    }
  );
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};
