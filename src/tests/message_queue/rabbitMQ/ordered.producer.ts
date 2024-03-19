// eslint-disable-next-line @typescript-eslint/no-var-requires
const orderedProducerMessage = require('amqplib')

async function producerOrderedMessage() {
  const connection = await orderedProducerMessage.connect('amqp://guest:guest@localhost')
  const channel = await connection.createChannel()

  const queueName = 'ordered-queued-message'
  await channel.assertQueue(queueName, { durable: true })

  for (let i = 0; i < 10; i++) {
    const message = `Message ${i}`
    await channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true
    })
  }

  setTimeout(() => {
    connection.close()
  }, 1000)
}

producerOrderedMessage().catch(console.error)
