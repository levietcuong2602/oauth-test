module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("clients", {
      id: {
        type: Sequelize.INTEGER(14),
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: Sequelize.STRING(255),
      client_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client_secret: { type: Sequelize.STRING, allowNull: false },
      redirect_uris: { type: Sequelize.STRING },
      grants: { type: Sequelize.STRING, allowNull: false },
    });
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("clients");
  },
};
