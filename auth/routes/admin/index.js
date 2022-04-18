/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
module.exports = (app) => {
  require('fs')
    .readdirSync('./auth/routes/admin')
    .forEach((fileName) => {
      if (fileName === 'index.js') return;
      if (['js'].indexOf(fileName.split('.').pop()) === -1) return;
      app.use('/api/admin', require(`./${fileName}`));
    });
};
