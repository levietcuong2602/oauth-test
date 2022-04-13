module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      nonce: {
        type: DataTypes.STRING(2000),
        allowNull: false,
      },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      client_id: { type: DataTypes.STRING },
      wallet_address: { type: DataTypes.STRING },
    },
    {
      tableName: 'sessions',
      underscored: true,
      timestamps: false,
    },
  );

  Session.associate = function (models) {
    // associations can be defined here
    Session.belongsTo(models.Client, {
      foreignKey: 'client_id',
    });
  };
  return Session;
};
