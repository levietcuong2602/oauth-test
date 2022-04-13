const { Joi } = require('express-validation');
const { customValidate } = require('./validationUtil');

const { GRANT_TYPE, STATUS_USER } = require('../constants');

const createClient = {
  body: Joi.object({
    name: Joi.string().required(),
    grants: Joi.array()
      .items(
        Joi.string()
          .trim()
          .valid(...Object.values(GRANT_TYPE))
          .required(),
      )
      .required(),
    redirect_uris: Joi.array().items(Joi.string().trim().required()).required(),
    client_secret: Joi.string().trim(),
    client_id: Joi.string().trim(),
  }),
};

const updateClient = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string(),
    grants: Joi.array().items(
      Joi.string()
        .trim()
        .valid(...Object.values(GRANT_TYPE)),
    ),
    redirect_uris: Joi.array().items(Joi.string().trim().required()),
  }),
};

const deleteClient = {
  params: Joi.object({
    id: Joi.string().required(),
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

const getRoles = {
  query: Joi.object({
    search: Joi.string().trim(),
  }),
};

const getUsers = {
  query: Joi.object({
    search: Joi.string().trim(),
    status: Joi.number().valid(...Object.values(STATUS_USER)),
    start_time: Joi.date(),
    end_time: Joi.date(),
    limit: Joi.number().default(10),
    page_num: Joi.number().default(1),
  }),
};

module.exports = {
  createClientValidate: customValidate(createClient),
  updateClientValidate: customValidate(updateClient),
  deleteClientValidate: customValidate(deleteClient),
  createRoleValidate: customValidate(createRole),
  updateRoleValidate: customValidate(updateRole),
  deleteRoleValidate: customValidate(deleteRole),
  getRolesValidate: customValidate(getRoles),
  createUserRoleValidate: customValidate(createUserRole),
  updateUserRoleValidate: customValidate(updateUserRole),
  deleteUserRoleValidate: customValidate(deleteUserRole),
  getUsersValidate: customValidate(getUsers),
};
