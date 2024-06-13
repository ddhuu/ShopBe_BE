"use strict";

const Logger = require("../loggers/discord.log");

const pushLogToDiscord = async (req, res, next) => {
  try {
    Logger.sendToFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `Endpoint: ${req.originalUrl}`,
    });
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pushLogToDiscord,
};
