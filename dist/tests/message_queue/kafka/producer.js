// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Kafka: KafkaProducer } = require('kafkajs');
const kafkaConfigProducer = {
    clientId: 'test-app',
    brokers: ['localhost:9092']
};
const kafkaProducer = new KafkaProducer(kafkaConfigProducer);
const producerKafka = kafkaProducer.producer();
const runProducer = async () => {
    await producerKafka.connect();
    await producerKafka.send({
        topic: 'test-topic',
        messages: [{ value: 'Hello KafkaJS user!' }]
    });
    await producerKafka.disconnect();
};
runProducer().catch(console.error);
