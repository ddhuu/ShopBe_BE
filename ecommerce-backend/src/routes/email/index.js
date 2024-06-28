"use strict";

const express = require("express");
const router = express.Router();

const asyncHandler = require("../../helpers/asyncHandler");
const { newTemplate } = require("../../controllers/email.controller");

router.post("/new_template", asyncHandler(newTemplate));

module.exports = router;
