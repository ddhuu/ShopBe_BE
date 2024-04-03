"use strict";

const { Types } = require("mongoose");
const { product } = require("../product.model");

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  await foundShop.save();

  return foundShop;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) {
    return null;
  }

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  await foundShop.save();

  return foundShop;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product.find({
    isPublished: true,
    $text: { $search: regexSearch }},{
    score: { $meta: "textScore" }},
  ).sort({score:{$meta: 'textScore'}}).lean().exec()

  return results;
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser
};
