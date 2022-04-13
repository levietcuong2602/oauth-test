module.exports = {
  // eslint-disable-next-line no-unused-vars
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
      'users',
      [
        {
          id: 1,
          username: 'customer@gmail.com',
          password:
            '08e23ab26bfe42830b267c16a742392c:2a0f42e488a7d2113f7215c555fed03dd0616a1584813324cff4508bf618e63e2b3d02c3b80e786bf7cf909269e7bc9f1908bbfaed9cfecc4aa0e913',
          wallet_address: '0xE5Df21aE71628A4c0C4655a5f3c90A56bA5393FF',
          status: 1,
        },
      ],
      {},
    );
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  },
};
