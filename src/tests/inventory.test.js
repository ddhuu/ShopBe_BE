const redisPublishService = require("../services/redisPublish.service");

class InventoryServiceTest {
  constructor() {
    redisPublishService.subscribe("purchase_events", (channel, message) => {
      InventoryServiceTest.updateInventory(message);
    });
  }

  static updateInventory(productId, quantity) {
    console.log(`Updat inventory ${productId} with ${quantity}`);
  }
}

module.exports = new InventoryServiceTest();
