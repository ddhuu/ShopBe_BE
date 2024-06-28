"use strict";

const { SuccessResponse } = require("../core/success.response");
const { newUserService } = require("../services/user.service");

class UserController {
  // new User
  newUser = async (req, res, next) => {
    const response = await newUserService({
      email: req.body.email,
    });

    await new SuccessResponse(response).send(res);
  };

  // check token
}

module.exports = new UserController();
