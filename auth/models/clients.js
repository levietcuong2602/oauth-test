module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'Client',
    {
      id: {
        type: DataTypes.INTEGER(14),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: DataTypes.STRING(255),
      client_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      client_secret: { type: DataTypes.STRING, allowNull: false },
      redirect_uris: { type: DataTypes.STRING },
      grants: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: 'clients',
      underscored: true,
      timestamps: false,
    },
  );
  // eslint-disable-next-line no-unused-vars
  Client.associate = function (models) {
    // associations can be defined here
  };
  return Client;
};
