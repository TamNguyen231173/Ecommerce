import dotenv from 'dotenv'

dotenv.config()

export const mongooseConfig = {
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017/express-typescript'
}

export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'secret',

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }
}
