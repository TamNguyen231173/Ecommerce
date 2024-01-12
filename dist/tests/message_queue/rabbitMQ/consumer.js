// eslint-disable-next-line @typescript-eslint/no-var-requires
const amqbConsumer = require('amqplib');
const consumer = async () => {
    try {
        const connection = await amqbConsumer.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'test-topic';
        await channel.assertQueue(queueName, { durable: true }); // create queue if not exist
        // send message to consumer channel
        channel.consume(queueName, (message) => {
            console.log(`Message received: ${message?.content.toString()}`);
        }, { noAck: true } // noAck: true means that the message will be removed from the queue once it is consumed
        );
    }
    catch (error) {
        console.error(error);
    }
};
consumer().catch(console.error);
