"use strict";

const amqp = require("amqplib");
const messages = "Hello, Order Message ";
async function consumerOrderMessage() {
  const connection = await amqp.connect("amqp://guest:3002@localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queued-message";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // set prefetch to atomic. Eusure only one ack at any monent

  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log("processed", message);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderMessage().catch((err) => console.error(err));
