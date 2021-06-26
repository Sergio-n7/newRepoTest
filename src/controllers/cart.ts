import { Request, Response, NextFunction } from 'express'

import cartServices from '../services/cart'

import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

export const findOneCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    res.json(await cartServices.findOneCart(userId))
  } catch (error) {
    next(new NotFoundError('Cart not found', error))
  }
}

export const createCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { garmetId, qty } = req.body
    const userId = req.params.userId

    res.json(await cartServices.createCart(userId, garmetId, qty))
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

//DELETE Products Requesst
export const deleteFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, garmetId } = req.params
    res.json(await cartServices.deleteFromCart(userId, garmetId))
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}

//DELETE Requesst
export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    res
      .status(204)
      .json({ deletedCart: await cartServices.deleteCart(userId) })
      .end()
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}
