const redisPublishService = require("../services/redisPublish.service");

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };

    redisPublishService.publish("purchase_events", JSON.stringify(order));
  }
}

module.exports = new ProductServiceTest();
