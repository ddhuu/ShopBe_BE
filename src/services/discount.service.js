"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount_end_date, discount } = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { convertToObjectId } = require("../utils");
const { findAllProducts } = require("./product.service");

/*
    Discount Services
    1- Generator Discount Code {Shop || Admin}
    2- Get discount amout {User}
    3- Get All Discount codes {User | Shop}
    4- Verify discount code {User}
    5- Delete discount Code {Admin | Shop}
    6- Cancel Discount Code {User}

*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      users_used,
      uses_count,
      max_uses_per_user,
    } = payload;

    // Create index for discount
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount Code already exists");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // Find discount
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();

    if (!foundDiscount) {
      throw new BadRequestError("Discount Code does not exist");
    }

    // Update discount
    const updatedDiscount = await discount.findOneAndUpdate(
      { discount_code: code, discount_shopId: convertToObjectId(shopId) },
      {
        discount_name: name,
        discount_decription: description,
        discount_type: type,
        discount_value: value,
        discount_min_order_value: min_order_value || 0,
        discount_max_value: max_value,
        discount_start_date: new Date(start_date),
        discount_end_date: new Date(end_date),
        discount_max_uses: max_uses,
        discount_uses_count: uses_count,
        discount_users_used: users_used,
        discount_shopId: shopId,
        discount_max_uses_per_user: max_uses_per_user,
        discount_is_active: is_active,
        discount_applies_to: applies_to,
        discount_product_ids: applies_to === "all" ? [] : product_ids,
      },
      { new: true } // This option returns the modified document
    );

    return updatedDiscount;
  }

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userID,
    limit,
    page,
  }) {
    // create index for discount_code

    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount Code does not exist");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let product;
    if (discount_applies_to === "all") {
      //get all
      product = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else {
      //get specific
      product = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return product;
  }

  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });

    return discounts;
  }

  /*
  Get discount code
  */

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount Code does not exist");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new NotFoundError("Discount Expired");
    }

    if (!discount_max_uses) {
      throw new NotFoundError("Discount Code has been used up");
    }

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("Discount Code has expired");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
    }

    if (totalOrder < discount_min_order_value) {
      throw new NotFoundError("Discount doest not meet min value");
    }

    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (
        userUserDiscount &&
        userUserDiscount.uses >= discount_max_uses_per_user
      ) {
        throw new NotFoundError("Discount Code has reached maximum usage");
      }
    }
    // Check xem discount nay la fixed amount

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discout.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectId(shopId),
    });

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount Code does not exist");
    }
    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
