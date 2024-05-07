"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:3002@localhost");
    if (!connection) {
      throw new Error("Connection to RabbitMQ failed");
    }
    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (error) {
    throw new Error(`Error connecting to RabbitMQ: ${error}`);
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    // Publish message to queue

    const queue = "test-queue";
    const message = "Hello, this is ddhuu.dev";
    await channel.assertQueue(queue, { durable: true });
    await channel.sendToQueue(queue, Buffer.from(message));

    // close connection

    await connection.close();
  } catch (error) {
    console.error(`Error connecting to RabbitMQ`, error);
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waitinh for meesage`);
    channel.consume(
      queueName,
      (msg) => {
        console.log(`Received message: ${msg.content.toString()}`);

        //1. Find User folling
        //2. Send Message to user
        //3. Ok => Success
        //4. Error => Set up DX
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(`Error consuming queue: ${error}`);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  consumerQueue,
};
