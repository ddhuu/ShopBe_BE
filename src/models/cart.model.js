"use strict";

const { model } = require("mongoose");

const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "false", "pending"],
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    /*
    [
        {
            productID,
            shopId,
            quantity,
            name,
            price
        },..
    ] 
    */

    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timeseries: {
      createdAt: "createOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
}
