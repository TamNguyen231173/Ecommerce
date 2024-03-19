// eslint-disable-next-line @typescript-eslint/no-var-requires
const amqbProducerDLX = require('amqplib');
const producerDLX = async () => {
    try {
        const connection = await amqbProducerDLX.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();
        const notificationExchange = 'notificationExchange'; // noti exchange direct
        const notiQueue = 'notificationQueueProcess'; // assert queue
        const notificationExchangeDLX = 'notificationExchangeDLX'; // noti exchange direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assert queue
        // create exchange
        await channel.assertExchange(notificationExchange, 'direct', { durable: true });
        // create queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        });
        // bind queue to exchange with routing key
        await channel.bindQueue(queueResult.queue, notificationExchange);
        // send message to consumer channel
        const msg = 'a new product has been created';
        console.log('producer msg::', msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: 3000 // 3s
        }); // send msg to queue
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    }
    catch (error) {
        console.error(error);
    }
};
producerDLX().catch(console.error);
