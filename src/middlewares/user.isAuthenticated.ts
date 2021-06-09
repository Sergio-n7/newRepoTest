import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'

import { UnauthorizedError } from '../helpers/apiError'

dotenv.config({ path: '.env' })

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.header('Authorization')
    const token = authorization?.split(' ')[1]
    if (!token) {
      return res.status(400).json({ msg: 'Invalid authentication' })
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (error, user) => {
      if (error) {
        next(new UnauthorizedError('Invalid token', error))
      }
      req.user = user
      next()
    })
  } catch (error) {
    next(new UnauthorizedError('No token', error))
  }
}
