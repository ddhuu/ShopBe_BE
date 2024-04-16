"use strict";

const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  /*
  {
    cartId,
    userId,
    shop_order_ids:
    [
        {
            shopId,
            shop_discount: [],
            item_products: [
                {
                    price,
                    quantity,
                    productId

                }
            ]

        },
        {
            shopId,
            shop_discount: [],
            item_products: [
                {
                    price,
                    quantity,
                    productId

                }
            ]

        }
    ]
  }
  */
  static async checkOutReview({ cartId, userId, shop_order_ids }) {
    // Check cartId exists
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError("Cart does not exist");
    }
    const checkoutOrder = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductServer = await checkProductByServer(item_products);
      console.log(`Check Product Server::`, checkProductServer);
      if (!checkProductServer[0]) {
        throw new NotFoundError("Product does not exist");
      }

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkoutOrder.totalPrice += checkoutPrice;
      let itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_product: checkProductServer,
      };

      // If shop_discounts exist and >0 , then

      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        checkoutOrder.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // Final

      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkoutOrder,
    };
  }
}

module.exports = CheckoutService;
