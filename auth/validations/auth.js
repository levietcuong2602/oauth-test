const { Joi } = require("express-validation");
const { customValidate } = require("./validationUtil");

const registerAccount = {
  body: Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
    client_id: Joi.string().trim().required(),
  }),
};

module.exports = { registerAccountValidate: customValidate(registerAccount) };
