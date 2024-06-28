"use strict";

const { SuccessResponse } = require("../core/success.response");
const { ErrorResponse } = require("../core/error.response");

const USER = require("../models/user.model");
const { sendEmailToken } = require("./email.service");
const newUserService = async ({ email = null, captcha = null }) => {
  // 1. Check email exist in dbs
  const user = await USER.findOne({ email }).lean();

  // 2. If exist
  if (user) {
    return ErrorResponse({
      message: "Email already existed",
    });
  }

  // 3. Send token via email

  const result = await sendEmailToken({
    email,
  });

  return {
    message: "Verify email user",
    metadata: {
      token: result,
    },
  };
};

module.exports = {
  newUserService,
};
