const { TOKEN_TYPE } = require("../constants");

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      token: {
        type: DataTypes.STRING,
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
    },
    {
      tableName: "tokens",
      underscored: true,
      timestamps: false,
    }
  );
  Token.associate = function (models) {
    // associations can be defined here
  };
  return Token;
};
