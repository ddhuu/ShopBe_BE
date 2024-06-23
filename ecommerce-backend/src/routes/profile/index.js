"use strict";

const express = require("express");
const router = express.Router();
const { profile, profiles } = require("../../controllers/profile.controller");
const { grantAccess } = require("../../middewares/rbac");

// admin

router.get("/viewAny", grantAccess("readAny", "Profile"), profiles);

// shop

router.get("/viewOwn", grantAccess("readOwn", "Profile"), profile);

module.exports = router;
