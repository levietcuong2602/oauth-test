const snakecaseKeys = require('snakecase-keys');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

const { User, sequelize } = require('../models');
const { STATUS_USER } = require('../constants');

const findUser = async (condition) => {
  const user = await User.findOne({
    where: snakecaseKeys(condition, { deep: true }),
  });

  return user
    ? user.get({
        plain: true,
      })
    : null;
};

const createUser = async (payload) => {
  const newUser = await User.create(snakecaseKeys(payload, { deep: true }));
  return newUser.get({
    plain: true,
  });
};

const deleteUser = async (condition) => {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await User.destroy({
    where: snakecaseKeys(condition, { deep: true }),
  });
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1'); // setting the flag back for security
};

const updateUser = async (userId, payload) => {
  await User.update(snakecaseKeys(payload, { deep: false }), {
    where: { id: userId },
  });
  const userUpdate = await findUser({
    id: userId,
  });
  return userUpdate;
};

const getUsers = async ({
  search,
  status,
  limit = 10,
  pageNum = 0,
  startTime,
  endTime,
}) => {
  const query = {};
  query.where = {};

  if (search) {
    query.where.username = {
      [Op.like]: `%${search}%`,
    };
  }
  if (Object.values(STATUS_USER).includes(status)) {
    query.where.status = status;
  }
  if (startTime && endTime) {
    query.where.created_at = {
      [Op.between]: [new Date(startTime), new Date(endTime)],
    };
  }
  query.raw = true;
  const model = await User.findAndCountAll(query);
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
  const data = await User.findAll({ ...query, limit, offset, raw: true });

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

module.exports = { findUser, createUser, deleteUser, updateUser, getUsers };
