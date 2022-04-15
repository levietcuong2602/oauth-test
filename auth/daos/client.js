const snakecaseKeys = require('snakecase-keys');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

const { Client } = require('../models');

const findClient = async (condition) => {
  const client = await Client.findOne({
    where: snakecaseKeys(condition, { deep: true }),
    raw: true,
  });

  return client;
};

const createClient = async (payload) => {
  const client = await Client.create(snakecaseKeys(payload, { deep: true }));
  return client.get({
    plain: true,
  });
};

const updateClient = async (id, payload) => {
  await Client.update(snakecaseKeys(payload, { deep: true }), {
    where: { id },
  });
  const client = await findClient({ id });
  return client;
};

const deleteClient = async (id) => {
  await Client.destroy({
    where: { id },
  });
};

const getClients = async ({
  search,
  limit = 10,
  pageNum = 0,
  startTime,
  endTime,
}) => {
  const query = {};
  query.where = {};

  if (search) {
    query.where.name = {
      [Op.like]: `%${search}%`,
    };
  }

  if (startTime && endTime) {
    query.where.created_at = {
      [Op.between]: [new Date(startTime), new Date(endTime)],
    };
  }
  query.raw = true;
  const model = await Client.findAndCountAll(query);
  const totalCount = model.count;
  if (totalCount <= 0)
    return {
      pager: {
        offset: 0,
        limit: 0,
        currentPageNum: 0,
        totalCount: 0,
        hasPrev: false,
        hasNext: false,
        prevPageNum: undefined,
        nextPageNum: undefined,
        lastPageNum: 0,
      },
      data: [],
    };

  const totalPage = Math.ceil(totalCount / limit);
  const currentPageNum = totalPage >= pageNum ? pageNum : 1; // <= totalPage ? pageNum : totalPage;
  const hasPrev = currentPageNum > 1;
  const hasNext = currentPageNum < totalPage;
  const offset = currentPageNum > 0 ? (currentPageNum - 1) * limit : 0;
  const data = await Client.findAll({ ...query, limit, offset, raw: true });

  return {
    pager: {
      offset,
      limit,
      currentPageNum,
      totalCount,
      hasPrev,
      hasNext,
      prevPageNum: hasPrev ? currentPageNum - 1 : undefined,
      nextPageNum: hasNext ? currentPageNum + 1 : undefined,
      lastPageNum: totalPage,
    },
    data,
  };
};

module.exports = {
  findClient,
  createClient,
  updateClient,
  deleteClient,
  getClients,
};
