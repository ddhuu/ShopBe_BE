"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const {
  newRole,
  listRole,
  newResource,
  listResource,
} = require("../../controllers/rbac.controller");
const router = express.Router();

router.post("/role", asyncHandler(newRole));
router.get("/roles", asyncHandler(listRole));

router.post("/resource", asyncHandler(newResource));
router.get("/resources", asyncHandler(listResource));
module.exports = router;
