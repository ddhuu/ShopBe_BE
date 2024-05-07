"use strict";

const messageService = require("./src/services/consumerQueue.service");

const queueName = "test-topic";

messageService
  .consumerToQueue(queueName)
  .then(() => {
    console.log(`Consumer started ${queueName}`);
  })
  .catch((err) => {
    console.error(`Message Error: ${err.message}`);
  });
