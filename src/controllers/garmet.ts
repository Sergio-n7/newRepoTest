import { Request, Response, NextFunction } from 'express'

import Garmet from '../models/Garmets'
import garmetServices from '../services/garmet'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST / Create garmets controller
export const createGarmet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputData = req.body
    const imagePath = req.file.path

    const garmet = new Garmet({
      title: inputData.title,
      description: inputData.description,
      category: inputData.category,
      countInStock: +inputData.countInStock,
      variant: {
        ...inputData.variant,
        price: +inputData.price,
        color: inputData.color,
        size: inputData.size,
      },
      image: imagePath,
      generalRating: inputData.generalRating ? inputData.generalRating : 0,
      reviews: [],
    })

    res.json(await garmetServices.createGarmet(garmet))
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /Update garmets/:garmetId controller
export const updateGarmet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.garmetId
    const inputData = req.body
    res.json(await garmetServices.updateGarmet(id, inputData))
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}

// DELETE /garmets/:garmetId controller
export const deleteGarmet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.garmetId
    res
      .status(204)
      .json({ deleteGarmet: await garmetServices.deleteGarmet(id) })
      .end()
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}

// GET /garmets/:garmetId only one garmet controller
export const findGarmetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await garmetServices.findGarmet(req.params.garmetId))
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}

// GET /Garmets all garmets controller
export const findAllGarmets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await garmetServices.findAll())
  } catch (error) {
    next(new NotFoundError('Garmets not found', error))
  }
}

// POST / Create a review controller
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputData = req.body
    const id = req.params.garmetId
    res.json(await garmetServices.createReview(id, inputData))
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Please enter a valid request', error))
    } else {
      next(new NotFoundError('Garmet not found', error))
    }
  }
}
