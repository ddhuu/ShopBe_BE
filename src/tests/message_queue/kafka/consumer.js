const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

const runConsumer = async () => {
  // Connecting the consumer
  await consumer.connect();

  // Subscribing to the same topic that the producer is producing to
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  // Running the consumer, each time a message is consumed, log it to the console
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
};

runConsumer().catch(console.error);
