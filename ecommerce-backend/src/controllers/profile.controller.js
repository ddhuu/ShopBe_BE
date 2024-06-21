"use strict";

const { SuccessResponse } = require("./../core/success.response");

const dataProfiles = [
  { usr_id: 1, usr_name: "CR7", usr_avt: "image.com" },
  { usr_id: 2, usr_name: "Messi", usr_avt: "image.com" },
  { usr_id: 3, usr_name: "Neymar", usr_avt: "image.com" },
];

class ProfileController {
  //admin
  profiles = async (req, res, next) => {
    new SuccessResponse({
      message: "view all profiles",
      metadata: dataProfiles,
    }).send(res);
  };
  //shop
  profile = async (req, res, next) => {
    new SuccessResponse({
      message: "view own profile",
      metadata: [{ usr_id: 1, usr_name: "CR7", usr_avt: "image.com" }],
    }).send(res);
  };
}

module.exports = new ProfileController();
