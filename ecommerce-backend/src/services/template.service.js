"use strict";
const { htmlEmailToken } = require("../utils/templateEmail.html");
const TEMPLATE = require("./../models/template.model");

const newTemplate = async ({ tem_name, tem_html, tem_id = 0 }) => {
  // 1. Check template if exist
  // 2. Create a new template

  const newTem = await TEMPLATE.create({
    tem_id,
    tem_name,
    tem_html: htmlEmailToken(),
  });

  return newTem;
};

const getTemplate = async ({ tem_name }) => {
  const template = await TEMPLATE.findOne({
    tem_name,
  });

  return template;
};

module.exports = {
  newTemplate,
  getTemplate,
};
