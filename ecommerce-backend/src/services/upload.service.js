"use strict";

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// Upload file use S3Client

const {
  s3,
  GetObjectCommand,
  PutObjectCommand,
  DeleteBucketCommand,
} = require("../config/s3.config");
const crypto = require("crypto");
const randomImageName = () => crypto.randomBytes(16).toString("hex");

const upLoadImageFromLocalToS3 = async ({ file }) => {
  try {
    const imageName = randomImageName();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    // export url

    const result = await s3.send(command);

    const signUrl = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    });
    const url = await getSignedUrl(s3, signUrl, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error Uploading image using S3 Client", error);
  }
};

module.exports = {
  upLoadImageFromLocalToS3,
};
