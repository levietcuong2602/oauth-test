const { Joi } = require('express-validation');
const { customValidate } = require('../validationUtil');

const { STATUS_USER } = require('../../constants');

const getUsers = {
  query: Joi.object({
    search: Joi.string().trim().allow(''),
    status: Joi.number().valid(...Object.values(STATUS_USER)),
    start_time: Joi.date(),
    end_time: Joi.date(),
    limit: Joi.number().default(10),
    page_num: Joi.number().default(1),
  }),
};

module.exports = {
  getUsersValidate: customValidate(getUsers),
};
