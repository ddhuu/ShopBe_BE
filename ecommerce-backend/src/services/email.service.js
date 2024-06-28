"use strict";
const { randomInt } = require("crypto");
const { getTemplate } = require("./template.service");
const { newOtp } = require("./otp.service");
const { NotFoundError } = require("../core/error.response");
const transport = require("../dbs/init.nodemailer");
const { replaceHolder } = require("../utils");

const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject = "Xác nhận email đăng ký",
  text = "Xác nhận ...",
}) => {
  try {
    const mailOptions = {
      from: '"SHOPBE" <ddhuu.dev@gmail.com>',
      to: toEmail,
      subject,
      text,
      html,
    };

    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log("Message sent::", info.messageId);
    });
  } catch (error) {
    console.error(`Error send Email`, error);
    return error;
  }
};

const sendEmailToken = async ({ email }) => {
  try {
    // 1. Get token
    const token = await newOtp({ email });
    // 2. Get template
    const template = await getTemplate({
      tem_name: "HTML EMAIL TOKEN",
    });

    if (!template) {
      throw new NotFoundError("Template not found");
    }

    // 3. Replace link_verify in template

    const content = replaceHolder(template.tem_html, {
      link_verify: `http://localhost:3057/cgb/welcome-back?token=${token.otp_token}`,
    });

    // 4. Send Email
    sendEmailLinkVerify({
      html: content,
      toEmail: email,
      subject: "Vui lòng xác nhận địa chỉ email đăng ký",
    }).catch((err) => console.error(error));

    return 1;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendEmailToken,
};
