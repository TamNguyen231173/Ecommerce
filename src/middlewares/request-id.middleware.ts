import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { myLogger } from '~/configs/myLogger.config'

export const requestIdMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) next(err)
  const requestId = req.headers['x-request-id']
  req.requestId = requestId as string || uuidv4().toString()
  myLogger.log(`input params ::${req.method}::`, [
    req.path,
    { requestId: req.requestId},
    req.method === 'POST' ? req.body : req.query
  ])
}