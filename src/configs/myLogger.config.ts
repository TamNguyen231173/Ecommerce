/**
 * @Author : Tamnh
 * @Date : 2021/09/18 - 09:56
 * @LastEditors : Tamnh
 * @LastEditTime : 2021/09/18 - 09:56
 * @Description : build myLogger config
 * @Copyright : 2024 Tamnh, All rights Reserved.
 */

import { Logger, createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { config } from '~/configs'
import { v4 as uuidv4 } from 'uuid'

type Params = { requestId?: string } | any[]

class MyLogger {
  private logger: Logger

  constructor() {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) =>
        `${timestamp} [${level}] [${requestId}] [${context}] ${message} ${JSON.stringify(metadata)}`
    )

    this.logger = createLogger({
      level: config.env === 'development' ? 'debug' : 'info',
      format: format.combine(
        this.enumerateErrorFormat(),
        config.env === 'development' ? format.colorize() : format.uncolorize(),
        format.splat(),
        formatPrint,
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
      ),
      transports: [
        new transports.Console({
          stderrLevels: ['error']
        }),
        new DailyRotateFile({
          dirname: 'src/logs',
          filename: 'application-%DATE%.info.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m', // if file size > 20mb, it will be rotated
          maxFiles: '14d', // if file age > 14 days, it will be deleted
          format: format.combine(
            this.enumerateErrorFormat(),
            format.splat(),
            formatPrint,
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
          ),
          level: 'info'
        }),
        new DailyRotateFile({
          dirname: 'src/logs',
          filename: 'application-%DATE%.error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m', // if file size > 20mb, it will be rotated
          maxFiles: '14d', // if file age > 14 days, it will be deleted
          format: format.combine(
            this.enumerateErrorFormat(),
            format.splat(),
            formatPrint,
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
          ),
          level: 'error'
        })
      ]
    })
  }

  enumerateErrorFormat() {
    return format.printf((info) => {
      if (info instanceof Error) {
        return `${info.level}: ${info.stack}`
      }
      return `${info.level}: ${info.message}`
    })
  }

  commonParams(params: Params) {
    let context: any,
      req: any = {},
      metadata: any = {}
    if (!Array.isArray(params)) {
      context = params
    } else {
      ;[context, req, metadata] = params
    }

    const requestId = req?.requestId || uuidv4()
    return {
      context,
      requestId,
      metadata
    }
  }

  log(message: string, params: Params) {
    const paramLog = this.commonParams(params)
    const logObject = Object.assign(
      {
        message
      },
      paramLog
    )

    this.logger.info(logObject)
  }

  error(message: string, params: Params) {
    const paramLog = this.commonParams(params)
    const logObject = Object.assign(
      {
        message
      },
      paramLog
    )

    this.logger.error(logObject)
  }
}

export const myLogger = new MyLogger()
