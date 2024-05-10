const amqp = require("amqplib");
const messages = "Hello, RabbitMQ ";

const log = console.log;
console.log = function () {
  log.apply(console, [new Date()].concat(arguments));
};
const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:3002@localhost");
    const channel = await connection.createChannel();

    const notificationExchange = "notificationEx"; // direct

    const notiQueue = "notificationQueueProcess"; // assert Queue

    const notificationExchangeDLX = "notificationExchangeDLX"; // dead letter exchange

    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

    // 1. Create Exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // 2. Create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3. binding Queue

    await channel.bindQueue(
      queueResult.queue,
      notificationExchange,
      "notification"
    );

    //4. Send message
    const msg = "Create new Product";
    console.log(`Producer msg::`, msg);

    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "5000",
    });

    setTimeout(() => {
      connection.close(), process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().catch(console.error);
