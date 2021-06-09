import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import { UnauthorizedError } from '../helpers/apiError'

// configurate dotenv
dotenv.config({ path: '.env' })

type User = {
  firstName: string;
  email: string;
  isAdmin: boolean;
  token: string;
}
// GET / is Admin or not by Id
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findOne({
      email: (req.user as User).email,
    })
    if (user?.isAdmin) {
      next()
    }
  } catch (error) {
    next(new UnauthorizedError('Invalid token', error))
  }
}
