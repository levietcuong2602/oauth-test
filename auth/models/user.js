module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
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
