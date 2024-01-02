declare namespace Express {
  export interface Response {
    errorMessage?: string
  }

  export interface Request {
    objKey?: any
    keyStore?: any
  }
}
