module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "clients",
      [
        {
          id: 1,
          name: "marketplace",
          client_id: "f3e0f812385b7a21a075d047670254e21eb05914",
          client_secret: "71775764d7cbd01a2a9c22a987026bc4da9370b5",
          redirect_uris: '["http://localhost:3030/client/app"]',
          grants: '["authorization_code","refresh_token"]',
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("clients", null, {});
  },
};
