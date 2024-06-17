"use strict";

const { PutObjectCommand } = require("@aws-sdk/client-s3");
// Upload file use S3Client

const { s3 } = require("../config/s3.config");
const crypto = require("crypto");

const upLoadImageFromLocalToS3 = async ({ file }) => {
  try {
    const randomImageName = () => crypto.randomBytes(16).toString("hex");
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: randomImageName(),
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await s3.send(command);
    return result;
  } catch (error) {
    console.error("Error Uploading image using S3 Client", error);
  }
};

module.exports = {
  upLoadImageFromLocalToS3,
};
