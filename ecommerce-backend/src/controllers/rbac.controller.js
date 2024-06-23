"use strict";

const {
  createResource,
  createRole,
  roleList,
  resourceList,
} = require("../services/rbac.service");
const { SuccessResponse } = require("./../core/success.response");

const newRole = async (req, res, next) => {
  new SuccessResponse({
    message: "Create new role successfully",
    metadata: await createRole(req.body),
  }).send(res);
};

const newResource = async (req, res, next) => {
  new SuccessResponse({
    message: "Create new resource successfully",
    metadata: await createResource(req.body),
  }).send(res);
};

const listRole = async (req, res, next) => {
  new SuccessResponse({
    message: "Get list roles successfully",
    metadata: await roleList(req.query),
  }).send(res);
};

const listResource = async (req, res, next) => {
  new SuccessResponse({
    message: "Create list resources successfully",
    metadata: await resourceList(req.query),
  }).send(res);
};

module.exports = {
  newRole,
  newResource,
  listRole,
  listResource,
};
