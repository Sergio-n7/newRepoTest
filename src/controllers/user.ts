import { Request, Response, NextFunction } from 'express'

// import the password-hashing bcript (secure password storage)
import bcrypt from 'bcrypt'

import User from '../models/User'
import userServices from '../services/user'
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from '../helpers/apiError'

// Post / create User controller
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, age, password, isAdmin } = req.body
    console.log(req.body, 'body from the controller')
    const user = new User({
      firstName,
      lastName,
      email,
      age,
      password: bcrypt.hashSync(password, 8),
      isAdmin,
    })
    console.log(user, 'user from controller')
    await userServices.createUser(user)
    res.json(user)
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(new InternalServerError('Internal Server Error', error))
    }
  }
}

// Post / create sing in User controller
export const singInUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    res.json(await userServices.singInUser(email, password))
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('User not valid', error))
    } else {
      next(new UnauthorizedError('Invalid email or password!!', error))
    }
  }
}
// delete User controller
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.userId
    res
      .status(204)
      .json({ deletedUser: await userServices.deleteUser(id) })
      .end()
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// Put or update user controller
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inputData = req.body
    const id = req.params.userId
    res.json(await userServices.updateUser(id, inputData))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// Get user by Id controller
export const findUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await userServices.findUser(req.params.userId))
  } catch (error) {
    next(new NotFoundError('User not found', error))
  }
}

// Get all users controller
export const findAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await userServices.findAll())
  } catch (error) {
    next(new NotFoundError('Users not found', error))
  }
}
