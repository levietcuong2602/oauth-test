const express = require("express");
const AdminJS = require("adminjs");
const dotenv = require("dotenv");
const AdminJSExpress = require("@adminjs/express");

const adminJs = new AdminJS({
  databases: [],
  rootPath: "/admin",
});

dotenv.config();
require("./config/sequelize");

const app = express();
const port = process.env.PORT || 3030;
const bodyParser = require("body-parser");
const expressSwagger = require("express-swagger-generator")(app);
const oauthServer = require("./oauth/server.js");

const errorHandler = require("./middlewares/errorHandler");
const snakecaseResponse = require("./middlewares/snakeCaseResponse");
const omitReq = require("./middlewares/omitReq");

const DebugControl = require("./utilities/debug.js");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(DebugControl.log.request());

let options = {
  swaggerDefinition: {
    info: {
      description: "This is a sample server",
      title: "Swagger",
      version: "1.0.0",
    },
    host: "localhost:3000",
    basePath: "/v1",
    produces: ["application/json", "application/xml"],
    schemes: ["http", "https"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "",
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ["./routes/**/*.js"], //Path to the API handle folder
};
expressSwagger(options);

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
