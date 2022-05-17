/* eslint-disable no-console */
const express = require('express');
const dotenv = require('dotenv');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const session = require('express-session');
const cp = require('cookie-parser');

dotenv.config();
require('./config/sequelize');

const app = express();
const port = process.env.PORT || 3030;
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const RedisStore = require('connect-redis')(session);

const oauthServer = require('./oauth/server');

const errorHandler = require('./middlewares/errorHandler');
const snakecaseResponse = require('./middlewares/snakeCaseResponse');
const omitReq = require('./middlewares/omitReq');

const DebugControl = require('./utilities/debug');
const { client } = require('./utilities/redis');

// Here we are configuring express to use body-parser as middle-ware.
app.use(
  session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    resave: false,
    store: new RedisStore({
      host: 'localhost',
      port: 6379,
      client,
      ttl: 260,
    }),
  }),
);
app.use(cors({ origin: 'http://localhost:8000', credentials: true }));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(DebugControl.log.request());

const swaggerOptions = {
  info: {
    version: '1.0.0',
    title: 'SSO API Documentation',
    description: 'Documentation for single sign on system',
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
  },
  filesPattern: './**/*.js',
  baseDir: __dirname,
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/api-docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v3/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
};

expressJSDocSwagger(app)(swaggerOptions);

// app.use(snakecaseResponse());
app.use(omitReq);

app.use('/captcha', require('./routes/captcha')); // Client routes
app.use('/client', require('./routes/client')); // Client routes
app.use('/oauth', require('./routes/auth')); // routes to access the auth stuff
// Note that the next router uses middleware. That protects all routes within this middleware
app.use(
  '/secure',
  (req, res, next) => {
    DebugControl.log.flow('Authentication');
    return next();
  },
  oauthServer.authenticate(),
  require('./routes/secure'),
); // routes to access the protected stuff

require('./routes/admin')(app);

app.use(errorHandler);

app.use('/', (req, res) => res.redirect('/client'));

app.listen(8080);
console.log('Oauth Server listening on port ', 8080);

module.exports = app; // For testing

global.CAPTCHA = 'initial';
