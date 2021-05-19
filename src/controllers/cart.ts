import { Request, Response, NextFunction } from 'express'

import User from '../models/User'
import UserService from '../services/user'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    const garmetId = req.params.garmetId
    const addedCart = await UserService.addToCart(userId, garmetId)
    res.json(addedCart)
  } catch (error) {
    next(new NotFoundError('Cart not found', error))
  }
}
