const { Joi } = require('express-validation');
const { customValidate } = require('../validationUtil');

const { GRANT_TYPE } = require('../../constants');

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

const getClients = {
  query: Joi.object({
    search: Joi.string().trim().allow(''),
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
  getClientsValidate: customValidate(getClients),
};
