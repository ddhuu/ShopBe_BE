"use strict";

const express = require("express");
const NotificatonsController = require("../../controllers/notification.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();

// Not login

// Authentication
router.use(authentication);
/////////////////////////

router.get("", asyncHandler(NotificatonsController.listNotiByUser));

module.exports = router;
