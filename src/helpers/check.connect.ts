import mongoose from 'mongoose'
import os from 'os'

const _SECOND = 5000

export const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024

    console.log('----------------------------------------')
    console.log('Number of connections: ', numConnection)
    console.log('Number of cores: ', numCores)
    console.log('Memory usage: ', memoryUsage, ' MB')
    console.log('----------------------------------------')

    if (numConnection > numCores * 7) {
      console.log('Overload!')
      // notify to admin
    }
  }, _SECOND) // Monitor every 5 seconds
}
