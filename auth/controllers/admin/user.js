const camelCaseKeys = require('camelcase-keys');

const userService = require('../../services/admin/user');

const DebugControl = require('../../utilities/debug');
const { successResponse } = require('../../utilities/response');

const getUsers = async (req, res) => {
  DebugControl.log.flow('Get users');
  const users = await userService.getUsers(
    camelCaseKeys(req.query, { deep: true }),
  );

  return successResponse(req, res, users);
};

module.exports = { getUsers };
