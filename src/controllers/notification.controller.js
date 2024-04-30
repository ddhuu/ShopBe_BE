"use strict";
const { SuccessResponse } = require("../core/success.response");

const {
  listNotiByUser,
  pushNotiToSystem,
} = require("../services/notification.service");

class NotificationsController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "List Notification by User",
      metadata: await listNotiByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationsController();
