"use strict";

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_AUTHOR,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = transport;
