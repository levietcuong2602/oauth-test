const { TOKEN_TYPE } = require("../constants");

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      id: {
        type: DataTypes.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      token: {
        type: DataTypes.STRING(2000),
        allowNull: false,
      },
      token_expires_at: { type: DataTypes.DATE, allowNull: false },
      client_id: { type: DataTypes.STRING, allowNull: false },
      user_id: { type: DataTypes.STRING, allowNull: false },
      type: {
        type: DataTypes.ENUM(Object.values(TOKEN_TYPE)),
        allowNull: false,
        default: TOKEN_TYPE.ACCESS_TOKEN,
      },
      reference_id: DataTypes.INTEGER(11),
      scope: DataTypes.STRING,
    },
    {
      tableName: "tokens",
      underscored: true,
      timestamps: false,
    }
  );
  Token.associate = function (models) {
    // associations can be defined here
    Token.belongsTo(models.Client, {
      foreignKey: "client_id",
    });

    Token.belongsTo(models.User, {
      foreignKey: "user_id",
    });
  };
  return Token;
};
