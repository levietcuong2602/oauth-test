const { Joi } = require("express-validation");
const { customValidate } = require("./validationUtil");

const registerAccount = {
  body: Joi.object({
    username: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    client_id: Joi.string().trim().required(),
  }),
};

const authorizeAccount = {
  body: Joi.object({
    username: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    client_id: Joi.string().trim().required(),
    redirect_uri: Joi.string().trim().required(),
    response_type: Joi.string().trim().required(),
    grant_type: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
  }),
};

const authorizeMobileAccount = {
  body: Joi.object({
    username: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    client_id: Joi.string().trim().required(),
  }),
};

module.exports = {
  registerAccountValidate: customValidate(registerAccount),
  authorizeAccountValidate: customValidate(authorizeAccount),
  authorizeMobileAccountValidate: customValidate(authorizeMobileAccount),
};
