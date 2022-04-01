const { Joi, validate } = require("express-validation");

const validateOptionsDefault = {
  context: true,
  keyByField: true,
};

module.exports.customValidate = (schema, options, joiOptions) => {
  return validate(
    schema,
    { ...validateOptionsDefault, ...options },
    joiOptions
  );
};
