import { Request, Response, NextFunction } from 'express'

import Garmet from '../models/Garmets'
import garmetServices from '../services/garmet'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

import cloudinary from '../configurations/cloudinary'

//GET all Request
export const findAll = async (
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

//Get one Request
export const findGarmet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.garmetId
    res.json(await garmetServices.findGarmet(id))
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}

//POST Request
export const createGarmet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputData = req.body

    const result = await cloudinary.uploader.upload(req.file.path)
    const image = result.secure_url

    const garmet = new Garmet({
      name: inputData.name,
      description: inputData.description,
      category: inputData.category,
      stock: +inputData.stock,
      variant: {
        ...inputData.variant,
        price: +inputData.price,
        color: inputData.color,
        size: inputData.size,
      },
      image: image,
      generalRating: inputData.totalRating ? inputData.totalRating : 0,
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

//PUT Request Review
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

//PUT request
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

//DELETE Requesst
export const deleteGarmet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.garmetId
    res
      .status(204)
      .json({ deletedGarmet: await garmetServices.deleteGarmet(id) })
      .end()
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}
