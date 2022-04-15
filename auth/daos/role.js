const snakecaseKeys = require('snakecase-keys');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

const { Role } = require('../models');
const pagination = require('../utilities/pagination');

const findRole = async (condition) => {
  const role = await Role.findOne({
    where: snakecaseKeys(condition, { deep: true }),
  });

  return role
    ? role.get({
        plain: true,
      })
    : null;
};

const createRole = async (payload) => {
  const role = await Role.create(snakecaseKeys(payload, { deep: true }));
  return role.get({
    plain: true,
  });
};

const updateRole = async (roleId, payload) => {
  await Role.update(snakecaseKeys(payload, { deep: true }), {
    where: {
      id: roleId,
    },
  });
  const role = await findRole({ id: roleId });
  return role;
};

const deleteRole = async (roleId) => {
  await Role.destroy({
    where: {
      id: roleId,
    },
  });
};

const getRoles = async ({ search, limit = 10, pageNum = 0 }) => {
  const query = {};
  query.where = {};

  if (search) {
    query.where.name = {
      [Op.like]: `%${search}%`,
    };
  }
  query.raw = true;
  const model = await Role.findAndCountAll(query);
  const totalCount = model.count;
  if (totalCount <= 0)
    return pagination({ data: [], limit, pageNum, totalCount });

  const totalPage = Math.ceil(totalCount / limit);
  const currentPageNum = totalPage >= pageNum ? pageNum : 1; // <= totalPage ? pageNum : totalPage;
  const offset = currentPageNum > 0 ? (currentPageNum - 1) * limit : 0;
  const data = await Role.findAll({ ...query, limit, offset, raw: true });

  return pagination({ data, limit, pageNum, totalCount });
};

module.exports = { findRole, createRole, updateRole, deleteRole, getRoles };
