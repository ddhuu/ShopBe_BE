"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// Authentication
router.use(authentication);

router.post("", asyncHandler(productController.createProduct));

// QUERY //

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));

module.exports = router;
