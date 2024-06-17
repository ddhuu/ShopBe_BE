"use strict";

const { SuccessResponse } = require("../core/success.response");
const { BadResponse, BadRequestError } = require("../core/error.response");
const { upLoadImageFromLocalToS3 } = require("../services/upload.service");

class UploadController {
  // use S3
  upLoadImageFromLocalToS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File Missing");
    }
    new SuccessResponse({
      message: "Upload image successfully using s3",
      metadata: await upLoadImageFromLocalToS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
