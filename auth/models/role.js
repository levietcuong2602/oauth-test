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
    },
  );
  // eslint-disable-next-line no-unused-vars
  Role.associate = function (models) {
    // associations can be defined here
  };
  return Role;
};
