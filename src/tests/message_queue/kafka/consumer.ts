import { EachMessagePayload, Kafka, KafkaConfig } from 'kafkajs'

const kafkaConfig: KafkaConfig = {
  clientId: 'test-app',
  brokers: ['localhost:9092']
}
const kafka = new Kafka(kafkaConfig)

const consumer = kafka.consumer({ groupId: 'test-group' })

export const runConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      console.log({
        value: message.value?.toString()
      })
    }
  })
}
