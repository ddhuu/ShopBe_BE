"use strict";

const Comment = require("../models/comment.model");
const { convertToObjectId } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { findProduct } = require("../models/repositories/product.repo");

class CommentService {
  /*
    Key features:
    + Add comment [user,shop]
    + Get a list of comment [user,shop]
    + delete Comment [user,shop,admin]
    */

  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;

    if (parentCommentId) {
      // Reply comment
      const parentComment = await Comment.findOne(
        convertToObjectId(parentCommentId)
      );
      if (!parentComment) {
        throw new NotFound("Parent comment not found");
      }

      rightValue = parentComment.comment_right;
      // updateMany comments
      await Comment.updateMany(
        {
          comment_productId: convertToObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await Comment.updateMany(
        {
          comment_productId: convertToObjectId(productId),
          comment_left: { $gte: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectId(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      } else {
        rightValue = 1;
      }

      // Insert to comment
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) {
        throw new NotFoundError("Parent comment not found");
      }
      const comments = await Comment.find({
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }
    const comments = await Comment.find({
      comment_productId: convertToObjectId(productId),
      comment_parentId: parentCommentId,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }
  static async deleteComment({ commentId, productId }) {
    // check the product exists in the database
    const foundProduct = await findProduct({
      product_id: productId,
    });

    if (!foundProduct) {
      throw new NotFoundError("Product Not Found");
    }
    // 1. Define left and right value
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError("Comment Not Found");
    }

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    // 2. Caculate width
    const width = rightValue - leftValue + 1;
    // 3. Delete all children Comments

    await Comment.deleteMany({
      comment_productId: convertToObjectId(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    // Update right
    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );

    await Comment.updateMany(
      {
        comment_productId: convertToObjectId(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );

    return true;
  }
}

module.exports = CommentService;
