/* eslint-disable no-param-reassign */
const getByPath = (obj, path) => {
  path = path.replace(/\[/g, '.').replace(/\]/g, '').split('.');
  path.forEach((level) => {
    obj = obj[level];
  });
  return obj;
};

module.exports = { getByPath };
