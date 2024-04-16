"use strict";

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: "Add Stock to Inventory Success",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
