// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EachMessagePayload, Kafka: KafkaConsumer, KafkaConfig } = require('kafkajs');
const kafkaConfig = {
    clientId: 'test-app',
    brokers: ['localhost:9092']
};
const kafka = new KafkaConsumer(kafkaConfig);
const consumerKafka = kafka.consumer({ groupId: 'test-group' });
const runConsumer = async () => {
    await consumerKafka.connect();
    await consumerKafka.subscribe({ topic: 'test-topic', fromBeginning: true });
    await consumerKafka.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value?.toString()
            });
        }
    });
};
runConsumer().catch(console.error);
