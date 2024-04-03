"use strict";

const ProductService = require("../services/product.service");

const { OK, CREATED, SuccessResponse } = require("./../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create Product Successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
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
        product_shop: req.user.userId
      }),
    }).send(res);
  };


  //END QUERY //
}

module.exports = new ProductController();
