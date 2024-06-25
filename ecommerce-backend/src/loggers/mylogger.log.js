/*
 error,
 warning,
 debug,
 info,
 request Id or Trace Id
*/

"use strict";

const {
  createLogger,
  format,
  transports,
  winston,
  addColors,
} = require("winston");
require("winston-daily-rotate-file");
const { v4: uuidv4 } = require("uuid");

const { combine, timestamp, json, align, printf, colorize } = format;

const COLOR = {
  error: "red",
  warning: "yellow",
  info: "green",
  debug: "blue",
};
addColors(COLOR);

const formatPrint = printf(
  ({ level, message, context, requestId, timestamp, metadata }) => {
    return `${timestamp}::{${level}::${context}::${requestId}::${message}::${JSON.stringify(
      metadata
    )}`;
  }
);

// Format for console that includes colorization
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  formatPrint
);

// Format for files without colorization
const fileFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  formatPrint
);

class MyLogger {
  constructor() {
    this.logger = createLogger({
      transports: [
        new transports.Console({
          format: consoleFormat,
        }),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.info.log",
          datePattern: "YY-MM-DD-HH-mm-ss",
          zipArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: fileFormat,
          level: "info",
        }),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.error.log",
          datePattern: "YY-MM-DD-HH-mm-ss",
          zipArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: fileFormat,
          level: "error",
        }),
      ],
    });
  }

  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestID || uuidv4();

    return {
      requestId,
      context,
      metadata,
    };
  }

  log(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramLog
    );
    this.logger.info(logObject);
  }

  error(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramLog
    );
    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();
