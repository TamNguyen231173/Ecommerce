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
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || '123456',
    username: process.env.REDIS_USERNAME || 'tamnguyen',
    ioRedisPort: process.env.REDIS_PORT || 6379,
    ioRedisHost: process.env.REDIS_HOST || 'localhost'
  },

  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },

  email: {
    from: process.env.SES_FROM_ADDRESS || 'tamnhShop@ecommerce.com',
    replyTo: process.env.EMAIL_REPLY_TO || 'tamnhShop@ecommerce.com',
    verifyUrl: process.env.EMAIL_VERIFY_URL || 'http://localhost:3000/email/verify'
  },

  elasticSearch: {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    index: process.env.ELASTICSEARCH_INDEX || 'express-typescript'
  }
}
