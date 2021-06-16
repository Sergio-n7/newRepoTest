import bcrypt from 'bcrypt'
import { getToken } from '../middlewares/user.token'
import UserModel, { UserDocument } from '../models/User'

// I first create all the types
type UserToken = Partial<UserDocument> & { token: string }

type FindAll = () => Promise<UserDocument[]>

type FindUser = (userId: string) => Promise<UserDocument>

type CreateUser = (user: UserDocument) => Promise<UserToken>

type SingInUser = (email: string, password: string) => Promise<UserToken>

type UpdateUser = (
  userId: string,
  inputData: Partial<UserDocument>
) => Promise<UserDocument>

type DeleteUser = (userId: string) => Promise<UserDocument | null>

// I create the services

// Find all user service
const findAll: FindAll = () => {
  return UserModel.find().exec()
}

// Find One User service
const findUser: FindUser = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId).exec()
    if (!user) {
      throw new Error(`User ${userId} not found.`)
    }
    return user
  } catch (error) {
    throw new Error(error.message)
  }
}

// Create User service
const createUser: CreateUser = async (user: UserDocument) => {
  const newUser = await user.save()
  const finalUser = {
    id: newUser._id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    age: newUser.age,
    isAdmin: newUser.isAdmin,
    token: getToken(newUser),
  }
  return finalUser
}

// Create Sing in User service
const singInUser: SingInUser = async (email: string, password: string) => {
  try {
    const singedUser = await UserModel.findOne({ email: email })
    if (singedUser && bcrypt.compareSync(password, singedUser.password)) {
      const userData = {
        id: singedUser.id,
        firstName: singedUser.firstName,
        email: singedUser.email,
        isAdmin: singedUser.isAdmin,
        token: getToken(singedUser),
      }
      return userData
    } else {
      throw new Error('Invalid email or password.')
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

// Create Update user service
const updateUser: UpdateUser = async (
  userId: string,
  inputData: Partial<UserDocument>
) => {
  try {
    const user = await UserModel.findById(userId).exec()
    console.log(inputData, 'data from the userService')

    if (!user) {
      throw new Error(`User ${userId} does not exist.`)
    }
    if (inputData.firstName) {
      user.firstName = inputData.firstName
    }
    if (inputData.lastName) {
      user.lastName = inputData.lastName
    }
    if (inputData.email) {
      user.email = inputData.email
    }
    if (inputData.age) {
      user.age = inputData.age
    }
    if (inputData.password) {
      user.password = inputData.password
    }

    if (
      Boolean(inputData.isAdmin) === true ||
      Boolean(inputData.isAdmin) === false
    ) {
      user.isAdmin = Boolean(inputData.isAdmin)
    }
    return user.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

// Create delete user service
const deleteUser: DeleteUser = (userId: string) => {
  return UserModel.findByIdAndDelete(userId).exec()
}

export default {
  findAll,
  findUser,
  createUser,
  updateUser,
  singInUser,
  deleteUser,
}
