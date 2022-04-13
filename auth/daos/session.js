const snakecaseKeys = require('snakecase-keys');

const { Session } = require('../models');

const findSession = async (condition) => {
  const session = await Session.findOne({
    where: snakecaseKeys(condition, { deep: true }),
  });

  return session
    ? session.get({
        plain: true,
      })
    : null;
};

const createSession = async (payload) => {
  const session = await Session.create(snakecaseKeys(payload, { deep: true }));
  return session.get({
    plain: true,
  });
};

const deleteSession = async (sessionId) => {
  await Session.destroy({
    where: {
      id: sessionId,
    },
  });
};

module.exports = { findSession, createSession, deleteSession };
