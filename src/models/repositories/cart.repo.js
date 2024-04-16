"use strict";
const { cart } = require("../cart.model");
const { convertToObjectId } = require("../../utils");

const findCartById = async (cartId) => {
  return await cart
    .findOne({
      _id: convertToObjectId(cartId),
      cart_state: "active",
    })
    .lean();
};

module.exports = {
  findCartById,
};
