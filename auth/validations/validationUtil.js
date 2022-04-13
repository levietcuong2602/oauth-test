const { validate } = require('express-validation');

const validateOptionsDefault = {
  context: true,
  keyByField: true,
};

module.exports.customValidate = (schema, options, joiOptions) =>
  validate(schema, { ...validateOptionsDefault, ...options }, joiOptions);
