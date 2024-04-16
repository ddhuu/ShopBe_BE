"ust strict";

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

/*
Key Features: Cart Service
+ Add product to cart (user)
+ Reduct product quantity by one (User)
+ Increase product quantity by One (User)
+ Get Cart (User)
+ Delete Card (User)
+ Delete Card Item (User)

*/

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      option = {
        upsert: true,
        new: true,
      };

    return cart.findOneAndUpdate(query, updateOrInsert, option);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };

    const userCart = await cart.findOne(query);

    if (!userCart) {
      throw new Error("Cart not found");
    }

    const productIndex = userCart.cart_products.findIndex(
      (p) => p.productId === productId
    );

    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    userCart.cart_products[productIndex].quantity += quantity;

    return await userCart.save();
  }

  static async addToCart({ userId, product = {} }) {
    // check whether cart is exist

    const userCart = await cart.findOne({ cart_userId: userId });

    if (!userCart) {
      // creat new cart
      return await CartService.createUserCart({ userId, product });
    }

    // Find product in the cart
    const productIndex = userCart.cart_products.findIndex(
      (p) => p.productId === product.productId
    );
    if (productIndex === -1) {
      userCart.cart_products.push(product);
      return await userCart.save();
    }

    // Cart is existing but do not have any products

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // Cart is existing and have this product => Update quantity

    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // Upate cart
  /*
  shop_order_ids: [
    {
      shopId,
      item_products:[
        {
          quantity,
          price,
          shopId,
          old_quantity
        }

      ],
      version
    }
  ]
  */

  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    //check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product does not exists ");
    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product does not exists in this shop");
    }

    if (quantity === 0) {
      //deleted
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleteCart = await cart.updateOne(query, updateSet);

    return deleteCart;
  }

  static async getListCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
