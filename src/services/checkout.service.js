"use strict";

const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock } = require("./redis.service");

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

  // Order

  static async orderByUser({
    shop_order_ids_new,
    cartId,
    userId,
    user_addres = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkOutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    // Check lai lan nua xem vuot ton kho hay khong
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]:`, products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);

      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // Neu co 1 san pham het thang trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Một số sản phẩm đã được cập nhật. Quý khách vui lòng quay lại giỏ hàng"
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // Neu insert thanh cong => Remove product co trong gio hang

    return newOrder;
  }

  /*
   Query Orders [User]
  */

  static async getOrdersByUser() {}

  /*
   Query Orders Using Id [User]
   */

  static async getOneOrderByUser() {}

  /*
   Cancel Order [Users]
   */
  static async cancelOrderByUser() {}

  /*
   Update Order Status [Shop || Admin]
  */

  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
