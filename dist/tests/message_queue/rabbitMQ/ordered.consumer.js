// eslint-disable-next-line @typescript-eslint/no-var-requires
const amqbProducerOrdered = require('amqplib');
async function consumerOrderedMessage() {
    const connection = await amqbProducerOrdered.connect('amqp://guest:guest@localhost');
    const channel = await connection.createChannel();
    const queueName = 'ordered-queued-message';
    await channel.assertQueue(queueName, { durable: true });
    // Set prefetch to 1 to ensure that a worker only receives one message at a time
    channel.prefetch(1);
    channel.consume(queueName, (msg) => {
        const message = msg.content.toString();
        setTimeout(() => {
            console.log(`Message received::${message}`);
            channel.ack(msg);
        }, Math.random() * 1000);
    });
}
consumerOrderedMessage().catch(console.error);
