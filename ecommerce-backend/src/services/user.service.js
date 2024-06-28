"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { ErrorResponse } = require("../core/error.response");

const USER = require("../models/user.model");
const { sendEmailToken } = require("./email.service");
const { checkEmailToken } = require("./otp.service");
const { createUser } = require("../models/repositories/user.repo");

const newUserService = async ({ email = null, captcha = null }) => {
  // 1. Check email exist in dbs
  const user = await USER.findOne({ email }).lean();

  // 2. If exist
  if (user) {
    throw new ErrorResponse("Email already existed");
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

const checkLoginEmailTokenService = async ({ token }) => {
  try {
    //1. Check token
    const { otp_email: email, otp_token } = await checkEmailToken({
      token,
    });
    if (!otp_token) throw Error("Token not found");

    //2. Check email

    const hasUser = await findUserByEmail({ email });

    if (hasUser) throw new ErrorResponse("Email already exists");
    const passwordHash = await bcrypt.hash(email, 10);

    const newUser = await createUser({
      usr_id: 1,
      usr_slug: "XYZ",
      usr_email: email,
      usr_name: email,
      usr_password: passwordHash,
      usr_role: "",
    });

    if (!newUser) {
      throw new BadRequestError("Error: User Creation Failed");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const keyStore = await KeyTokenService.createKeyToken({
      userID: newUser._id,
      publicKey,
      privateKey,
    });

    if (!keyStore) {
      throw new BadRequestError("Error: Create KeyStore Failed");
    }

    const tokens = await createTokenPair(
      { userID: newUser._id, email },
      publicKey,
      privateKey
    );

    return {
      code: 201,
      message: "Verify Successfully",
      metadata: {
        user: getInfoData({
          fields: ["_id", "usr_name", "usr_email"],
          object: newUser,
        }),
        tokens,
      },
    };
  } catch (error) {
    throw Error(error.message);
  }
};

const findUserByEmail = async ({ email }) => {
  try {
    const user = await USER.findOne({ usr_email: email }).lean();
    return user;
  } catch (error) {
    throw Error("Error find user by email");
  }
};
module.exports = {
  newUserService,
  checkLoginEmailTokenService,
  findUserByEmail,
};
