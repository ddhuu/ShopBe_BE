"use strict";

const {
  consumerToQueue,
  consumerToQueueNormal,
  consumerToQueueDLX,
} = require("./src/services/consumerQueue.service");

const queueName = "test-topic";

consumerToQueueNormal(queueName)
  .then(() => {
    console.log(`Consumer to queue normal start ${queueName} `);
  })
  .catch((err) => {
    console.error(`Consumer to queue normal error ${err}`);
  });

consumerToQueueDLX(queueName)
  .then(() => {
    console.log(`Consumer to queue DLX start ${queueName} `);
  })
  .catch((err) => {
    console.error(`Consumer to queue DLX error ${err}`);
  });
