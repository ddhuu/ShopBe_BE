"use strict";

const RESOURCE = require("../models/resource.model");
const ROLE = require("../models/role.model");

/**
 * Create new Resource
 *@param {string} name
 *@param {string} slug
 *@param {string} description
 */

const createResource = async ({
  name = "profile",
  slug = "p001",
  description = "",
}) => {
  try {
    //1. Check name or slug exists
    //2. Create new Resource
    const resource = await RESOURCE.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  } catch (error) {
    return error;
  }
};

const resourceList = async (
  userId = 0,
  limit = 30,
  offset = 0,
  search = ""
) => {
  //1. CHeck admin in Middleware

  //2. Get list resources

  try {
    const resources = await RESOURCE.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createAt: 1,
        },
      },
    ]);

    return resources;
  } catch (error) {
    return [];
  }
};

const createRole = async ({
  name = "shop",
  slug = "s00001",
  description = "",
  grants = [],
}) => {
  try {
    // 1. Check role is exist
    // 2. Create new role

    const role = await ROLE.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });

    return role;
  } catch (error) {
    return error;
  }
};

const roleList = async (userId = 0, limit = 30, offset = 0, search = "") => {
  try {
    // 1. userId
    // 2. list Role

    const roles = await ROLE.aggregate([
      {
        $unwind: "$rol_grants",
      },
      {
        $lookup: {
          from: "Resources",
          localField: "rol_grants.resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $project: {
          role: "$rol_name",
          resource: "$resource.src_name",
          action: "$rol_grants.actions",
          attributes: "$rol_grants.attributes",
        },
      },
      {
        $unwind: "$action",
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: "$action",
          attributes: 1,
        },
      },
    ]);

    return roles;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
