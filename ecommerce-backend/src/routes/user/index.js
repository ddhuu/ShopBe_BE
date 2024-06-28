"use strict";

const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const {
  newUser,
  checkLoginMailToken,
} = require("../../controllers/user.controller");

router.post("/new_user", asyncHandler(newUser));
router.post("/welcome-back", asyncHandler(checkLoginMailToken));

module.exports = router;
