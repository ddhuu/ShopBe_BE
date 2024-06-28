"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "Conflict error",
};

const myLogger = require("../loggers/mylogger.log");
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
const reasonPhrases = require("../utils/reasonPhrases");

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;

    this.now = Date.now();

    // myLogger.error(this.message, [
    //   "/api/v1/login",
    //   "vv12345",
    //   {
    //     error: "Bad Request Error",
    //   },
    // ]);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICTED
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}
class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ErrorResponse,
};
