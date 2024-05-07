"use strict";

const { connectToRabbitMQForTest } = require("../dbs/init.rabbit");

describe("RabbitMQ Connection", () => {
  it("Connect to RabbitMQ successfully", async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});
