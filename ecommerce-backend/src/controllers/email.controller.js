"use strict";

const { SuccessResponse } = require("../core/success.response");
const { newTemplate } = require("../services/template.service");

class EmailController {
  newTemplate = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Template",
      metadata: await newTemplate(req.body),
    }).send(res);
  };
}

module.exports = new EmailController();
