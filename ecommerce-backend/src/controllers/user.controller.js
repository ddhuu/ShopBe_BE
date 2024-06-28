"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  newUserService,
  checkLoginEmailTokenService,
} = require("../services/user.service");

class UserController {
  // new User
  newUser = async (req, res, next) => {
    const response = await newUserService({
      email: req.body.email,
    });

    new SuccessResponse(response).send(res);
  };

  // check token vie mail

  checkLoginMailToken = async (req, res, next) => {
    const { token = null } = req.query;
    const response = await checkLoginEmailTokenService({
      token,
    });

    new SuccessResponse(response).send(res);
  };
}

module.exports = new UserController();
