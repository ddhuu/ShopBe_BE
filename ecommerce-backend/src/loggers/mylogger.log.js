"use strict";

// const { format } = require("morgan");
const { createLogger, format, transports, winston } = require("winston");
require("winston-daily-rotate-file");
const { v4: uuidv4 } = require("uuid");

const { combine, timestamp, json, align, printf } = format;

class MyLogger {
  constructor() {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::{${level}::${context}::${requestId}::${message}::${JSON.stringify(
          metadata
        )}`;
      }
    );
    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint
      ),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.info.log",
          datePattern: "YY-MM-DD-HH-mm-ss",
          zipArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
          level: "info",
        }),
        new transports.DailyRotateFile({
          dirname: "src/logs",
          filename: "application-%DATE%.error.log",
          datePattern: "YY-MM-DD-HH-mm-ss",
          zipArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: format.combine(
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            formatPrint
          ),
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
