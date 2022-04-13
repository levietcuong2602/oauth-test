const userDao = require('../../daos/user');

const getUsers = async ({ limit, pageNum, ...condition }) => {
  const users = await userDao.getUsers({
    ...condition,
    limit: parseInt(limit, 10) || 10,
    pageNum: parseInt(pageNum, 10) > 0 ? +pageNum : 1,
  });

  return users;
};

module.exports = { getUsers };
