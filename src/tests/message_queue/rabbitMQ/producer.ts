// eslint-disable-next-line @typescript-eslint/no-var-requires
const amqbProducer = require('amqplib')

const message = 'Hello World!, from producer'

const producer = async () => {
  try {
    const connection = await amqbProducer.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()
    const queueName = 'test-topic'
    await channel.assertQueue(queueName, { durable: true }) // create queue if not exist

    // send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message))
    console.log(`Message sent: ${message}`)
  } catch (error) {
    console.error(error)
  }
}

producer().catch(console.error)
