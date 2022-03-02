const express = require("express");
const config = require("./configs");
// const morgan = require('morgan');
// const morganBody = require('morgan-body');
const compress = require("compression");
// const methodOverride = require('method-override');
// const session = require('express-session');
const cors = require("cors"); //For cross domain error
const fs = require("fs");
const path = require("path");
const timeout = require("connect-timeout");
const glob = require("glob");

module.exports = function () {
  var app = express(
    express.urlencoded({
      limit: "50mb",
      extended: true,
    })
  );

  // create a write stream (in append mode)
  var accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
  );

  // setup the logger
  // app.use(morgan('combined', { stream: accessLogStream }))
  // app.use(morgan(':remote-addr :method :url :status - :date', { stream: accessLogStream }));

  //console.log(__dirname)
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else if (process.env.NODE_ENV === "production") {
    app.use(compress({ threshold: 2 }));
  }

  app.use(
    express.urlencoded({
      limit: "50mb",
      extended: true,
    })
  );

  app.use(
    express.json({
      limit: "50mb",
      extended: true,
    })
  );
  // morganBody(app, { logReqDateTime: false, logReqUserAgent: false, theme: 'dimmed', stream: accessLogStream });

  // Uncomment to force https
  // app.set('forceSSLOptions', {
  //   enable301Redirects: true,
  //   trustXFPHeader: false,
  //   httpsPort: 443,
  //   sslRequiredMessage: 'SSL Required.'
  // });
  // app.use(forceSSL);

  // app.use(methodOverride());

  app.use(cors());

  // =======   Settings for CORS
  app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
    );
    next();
  });

  app.use(timeout(120000));
  app.use(haltOnTimedout);

  function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
  }

  app.use((err, req, res, next) => {
    return res.send({
      status: 0,
      statusCode: 500,
      message: err.message,
      error: err,
    });
  });

  // app.use(session({
  //   cookie: { maxAge: 30000 },
  //   saveUninitialized: true,
  //   resave: true,
  //   secret: config.sessionSecret
  // }));

  // app.use(express.json({
  //   limit: "50mb",
  //   extended: true
  // }));

  // =======   Routing
  const modules = "/../app/modules";
  glob(__dirname + modules + "/**/*Routes.js", {}, (err, files) => {
    files.forEach((route) => {
      const stats = fs.statSync(route);
      const fileSizeInBytes = stats.size;
      if (fileSizeInBytes) {
        require(route)(app, express);
      }
    });
  });

  return app;
};
