"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const { upload } = require("../../config/multer.config");

// Upload S3

router.post(
  "/product/bucket",
  upload.single("file"),
  asyncHandler(uploadController.upLoadImageFromLocalToS3)
);

module.exports = router;
