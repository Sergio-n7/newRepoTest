import { Request, Response, NextFunction } from 'express'

import Garmet from '../models/Garmets'
import GarmetService from '../services/garmet'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError'

// POST /garmets
export const createGarmet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, category, genres, brand, size, season, garmetRef } = req.body

    const garmet = new Garmet({
      name,
      category,
      genres,
      brand,
      size,
      season,
      garmetRef,
    })

    await GarmetService.create(garmet)
    res.json(garmet)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// PUT /Update garmets/:garmetId
export const updateGarmet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = req.body
    const garmetId = req.params.garmetId
    const updatedGarmet = await GarmetService.update(garmetId, update)
    res.json(updatedGarmet)
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}

// DELETE /garmets/:garmetId
export const deleteGarmet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await GarmetService.deleteGarmet(req.params.garmetId)
    res.status(204).end()
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}

// GET /garmets/:garmetId
export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await GarmetService.findById(req.params.garmetId))
  } catch (error) {
    next(new NotFoundError('Garmet not found', error))
  }
}

// GET /Garmets
export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await GarmetService.findAll())
  } catch (error) {
    next(new NotFoundError('Garmets not found', error))
  }
}
