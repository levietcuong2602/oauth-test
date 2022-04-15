const clientDao = require('../../daos/client');

const getClients = async ({ limit, pageNum, ...condition }) => {
  const roles = await clientDao.getClients({
    ...condition,
    limit: parseInt(limit, 10) || 10,
    pageNum: parseInt(pageNum, 10) > 0 ? +pageNum : 1,
  });

  return roles;
};

module.exports = { getClients };
