import Redis from 'ioredis'
import { config } from '~/configs'

class IORedis {
  private client: Redis

  public init({ IS_IOREDIS_ENABLED }: { IS_IOREDIS_ENABLED: boolean }) {
    if (IS_IOREDIS_ENABLED) {
      this.client = new Redis({
        port: Number(config.redis.ioRedisPort),
        host: config.redis.ioRedisHost
      })
      this.client.on('error', (error) => {
        console.log('Redis error: ', error)
      })
      this.client.on('connect', () => {
        console.log('Redis connected')
      })
      this.client.on('ready', () => {
        console.log('Redis ready')
      })
      this.client.on('reconnecting', () => {
        console.log('Redis reconnecting')
      })
      this.client.on('end', () => {
        console.log('Redis end')
      })
      this.client.on('close', () => {
        console.log('Redis close')
      })
    }
  }

  public getClient() {
    return this.client
  }
}

const ioredis = new IORedis()
export default ioredis
