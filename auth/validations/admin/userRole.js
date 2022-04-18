const { Joi } = require('express-validation');
const { customValidate } = require('../validationUtil');

const createUserRole = {
  body: Joi.object({
    user_id: Joi.string().required(),
    client_id: Joi.string().required(),
    role_id: Joi.string().required(),
  }),
};

const updateUserRole = {
  query: Joi.object({
    user_id: Joi.string().required(),
    client_id: Joi.string().required(),
  }),
  body: Joi.object({
    role_id: Joi.string().required(),
  }),
};

const deleteUserRole = {
  query: Joi.object({
    user_id: Joi.string().required(),
    client_id: Joi.string().required(),
  }),
};

module.exports = {
  createUserRoleValidate: customValidate(createUserRole),
  updateUserRoleValidate: customValidate(updateUserRole),
  deleteUserRoleValidate: customValidate(deleteUserRole),
};
