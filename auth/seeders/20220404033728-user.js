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
    // password: 123
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: 1,
          username: "customer",
          password:
            "08e23ab26bfe42830b267c16a742392c:2a0f42e488a7d2113f7215c555fed03dd0616a1584813324cff4508bf618e63e2b3d02c3b80e786bf7cf909269e7bc9f1908bbfaed9cfecc4aa0e913",
          wallet_address: "",
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
    await queryInterface.bulkDelete("users", null, {});
  },
};
