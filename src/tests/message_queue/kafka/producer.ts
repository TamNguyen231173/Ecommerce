import { Kafka, KafkaConfig } from 'kafkajs'

const kafkaConfig: KafkaConfig = {
  clientId: 'test-app',
  brokers: ['localhost:9092']
}
const kafka = new Kafka(kafkaConfig)

const producer = kafka.producer()

export const runProducer = async () => {
  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      {
        value: 'Hello KafkaJS user!',
        headers: { source: 'test-app' }
      }
    ]
  })

  await producer.disconnect()
}
