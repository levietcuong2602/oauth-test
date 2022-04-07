const express = require("express");
const AdminJS = require("adminjs");
const dotenv = require("dotenv");
const AdminJSExpress = require("@adminjs/express");
const expressJSDocSwagger = require("express-jsdoc-swagger");

const adminJs = new AdminJS({
  databases: [],
  rootPath: "/admin",
});

dotenv.config();
require("./config/sequelize");

const app = express();
const port = process.env.PORT || 3030;
const bodyParser = require("body-parser");
const oauthServer = require("./oauth/server.js");

const errorHandler = require("./middlewares/errorHandler");
const snakecaseResponse = require("./middlewares/snakeCaseResponse");
const omitReq = require("./middlewares/omitReq");

const DebugControl = require("./utilities/debug.js");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(DebugControl.log.request());

const swaggerOptions = {
  info: {
    version: "1.0.0",
    title: "SSO API Documentation",
    description: "Documentation for single sign on system",
  },
  security: {
    BasicAuth: {
      type: "http",
      scheme: "basic",
    },
  },
  filesPattern: "./**/*.js",
  baseDir: __dirname,
  // URL where SwaggerUI will be rendered
  swaggerUIPath: "/api-docs",
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: "/v3/api-docs",
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
};

expressJSDocSwagger(app)(swaggerOptions);

app.use(snakecaseResponse());
app.use(omitReq);

app.use("/client", require("./routes/client.js")); // Client routes
app.use("/oauth", require("./routes/auth.js")); // routes to access the auth stuff
// Note that the next router uses middleware. That protects all routes within this middleware
app.use(
  "/secure",
  (req, res, next) => {
    DebugControl.log.flow("Authentication");
    return next();
  },
  oauthServer.authenticate(),
  require("./routes/secure.js")
); // routes to access the protected stuff

const router = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, router);

app.use("/api/admin", require("./routes/admin"));
app.use(errorHandler);

app.use("/", (req, res) => res.redirect("/client"));

app.listen(port);
console.log("Oauth Server listening on port ", port);

module.exports = app; // For testing
