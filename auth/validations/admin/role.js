const { Joi } = require('express-validation');
const { customValidate } = require('../validationUtil');

const getRoles = {
  query: Joi.object({
    search: Joi.string().trim().allow(''),
    limit: Joi.number().default(10),
    page_num: Joi.number().default(1),
  }),
};

const createRole = {
  body: Joi.object({
    name: Joi.string().required(),
    is_default: Joi.boolean().default(false),
  }),
};

const updateRole = {
  params: Joi.object({
    role_id: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string(),
    is_default: Joi.boolean(),
  }),
};

const deleteRole = {
  params: Joi.object({
    role_id: Joi.string().required(),
  }),
};

module.exports = {
  getRolesValidate: customValidate(getRoles),
  createRoleValidate: customValidate(createRole),
  updateRoleValidate: customValidate(updateRole),
  deleteRoleValidate: customValidate(deleteRole),
};
