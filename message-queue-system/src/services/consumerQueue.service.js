"use strict";

const { consumerQueue, connectToRabbitMQ } = require("../dbs/init.rabbit");

const log = console.log;

console.log = function () {
  log.apply(console, [new Date().toISOString(), ...arguments]);
};

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error(`Error consuming queue: ${error}`);
      throw error;
    }
  },
  // case processing
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel } = await connectToRabbitMQ();
      const notiQueue = "notificationQueueProcess";

      // 1. TTL

      // const timeExpire = 3000;

      // setTimeout(() => {
      //   channel.consume(notiQueue, (msg) => {
      //     console.log(
      //       `Send notification successfully :`,
      //       msg.content.toString()
      //     );
      //     channel.ack(msg);
      //   });
      // }, timeExpire);

      // 2. LOGIC

      channel.consume(notiQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log({ numberTest });

          if (numberTest < 0.8) {
            throw new Error("Send Notification failed:: HOT FIX");
          }

          console.log(`Send notification successfully :`);
          channel.ack(msg);
        } catch (error) {
          // console.error(`SEND notification error`, error);
          channel.nack(msg, false, false);
          /*
          nack: Negative Acknowledgement
          */
        }
      });
    } catch (error) {
      console.error(`Error consuming queue: ${error}`);
      throw error;
    }
  },

  // case failed processing
  consumerToQueueDLX: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationExchangeDLX = "notificationExchangeDLX"; // dead letter exchange

      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

      const notiQueueHandler = "notificationQueueHotFix";

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );

      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            `Send notification failed, please hot fix :`,
            msgFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(`Error consuming queue: ${error}`);
      throw error;
    }
  },
};

module.exports = messageService;
