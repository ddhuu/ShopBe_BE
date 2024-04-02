"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

// define Factory class to create product

class ProductFactory {
    /*
        type: 'Clothing',
        payload
    */
  static async createProduct(type,payload) {
    switch (type){
        case 'Electronics':
            return new Electronics(payload).createProduct();
        case 'Clothing':
            return new Clothing(payload).createProduct()
    }
  }
}

// Define base product class

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product

  async createProduct() {
    return await product.create(this);
  }
}

// Define sub-class for differenr product types Clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) {
      throw new BadRequestError("Cannot Create new Product");
    }
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Cannot Create new Product");

    return newProduct;
  }
}

// Define sub-class for differenr product types Electronics

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronic.create(this.product_attributes);
    if (!newElectronics) {
      throw new BadRequestError("Cannot Create new Product");
    }

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Cannot Create new Product");

    return newProduct;
  }
}


module.exports =ProductFactory;