"use strict";

const ProductService = require("../services/product.service");

const {SuccessResponse } = require("./../core/success.response");

class ProductController {

  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create Product Successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product Successfully",
      metadata: await ProductService.updateProduct(req.body.product_type,
        req.params.product_id,{
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  




  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product Successfully",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Un Publish product Successfully",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // QUERY //
  /**
   * @desc Get All Drafts for Shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list of draft successfully",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublicForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list of Published successfully",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Search successfully",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List All successfully",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List All successfully",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  //END QUERY //
}

module.exports = new ProductController();
