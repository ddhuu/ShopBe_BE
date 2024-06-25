"use strict";

const { BadRequestError } = require("../core/error.response");
const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require("./../core/success.response");

class AccessController {
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Log out Successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Email is required");
    }
    const sendData = Object.assign({ requestId: req.requestId }, req.body);

    const { code, ...result } = await AccessService.login(sendData);
    if (code === 200) {
      new SuccessResponse({
        metadata: result,
      }).send(res);
    }
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
