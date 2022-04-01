const { Joi } = require("express-validation");
const { customValidate } = require("./validationUtil");

const { GRANT_TYPE } = require("../constants");

const createClient = {
  body: Joi.object({
    client_id: Joi.string().trim().required(),
    grants: Joi.array()
      .items(
        Joi.string()
          .trim()
          .valid(...Object.values(GRANT_TYPE))
          .required()
      )
      .required(),
    redirect_uris: Joi.array().items(Joi.string().trim().required()).required(),
    client_secret: Joi.string().trim().required(),
  }),
};

module.exports = { createClientValidate: customValidate(createClient) };
