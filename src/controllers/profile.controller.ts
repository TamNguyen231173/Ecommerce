import { Request, Response } from 'express'
import httpStatus from 'http-status'

const profiles = [
  { _id: 1, name: 'John Denal' },
  { _id: 2, name: 'Jane Ion' },
  { _id: 3, name: 'Jack Known' }
]
export class ProfileController {
  static async getProfiles(req: Request, res: Response) {
    res.status(httpStatus.OK).json({
      message: 'Get profiles successfully',
      data: profiles
    })
  }

  static async getProfile(req: Request, res: Response) {
    console.log(req.params.id)
    const profile = profiles.find((profile) => profile._id === Number(req.params.id))
    res.status(httpStatus.OK).json({
      message: 'Get profile successfully',
      data: profile
    })
  }
}
