"use strict";

const express = require("express");
const CommentController = require("../../controllers/comment.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();

// Authentication

router.use(authentication);
/////////////////////////

router.post("", asyncHandler(CommentController.createComment));
router.get("", asyncHandler(CommentController.getCommentsByParentId));
router.delete("", asyncHandler(CommentController.deleteComment));

module.exports = router;
