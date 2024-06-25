require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { v4: uuidv4 } = new require("uuid");
const myLogger = require("./loggers/mylogger.log");

const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || uuidv4();
  myLogger.log(`Input Params::${req.method}`, [
    req.path,
    {
      requestId: req.requestId,
    },
    req.method === "POST" ? req.body : req.quey,
  ]);
  next();
});

// init db

require("./dbs/init.db");

// Init Router
app.use("", require("./routes"));

// Handling Error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const resMessage = `${error.status}-${
    Date.now() - error.now
  }ms - Response: ${JSON.stringify(error)}`;
  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    {
      message: error.message,
    },
  ]);
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
    stack: error.stack,
  });
});

module.exports = app;
