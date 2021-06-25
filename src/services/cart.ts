import { GarmetDocument } from '../models/Garmets'
import cartModel, { CartDocument } from '../models/Cart'

type FindCart = (userId: string) => Promise<CartDocument>
type CreateCart = (
  userId: string,
  garmetId: string,
  qty: number
) => Promise<CartDocument>
type DeleteFromCart = (
  userId: string,
  garmetId: string
) => Promise<CartDocument>
type DeleteCart = (userId: string) => Promise<CartDocument | null>

const findCart: FindCart = async (userId: string) => {
  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate('user items.garmet', '_id email _id title variant.price image')
      .exec()
    if (!cart) {
      throw new Error(`User cart ${userId} not found.`)
    }
    return cart
  } catch (error) {
    throw new Error(error.message)
  }
}

const createCart: CreateCart = async (
  userId: string,
  garmetId: string,
  qty: number
) => {
  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate('user items.garmet', '_id email _id title variant.price image')
      .exec()
    if (!cart) {
      const newCart = new cartModel({
        user: userId,
        items: [
          {
            garmet: garmetId,
            qty: qty,
          },
        ],
      })
      return newCart.save()
    }
    const addedGarmet = cart.items.find((item) => {
      return (item.garmet as GarmetDocument)._id == garmetId
    })
    if (addedGarmet) {
      addedGarmet.qty += qty
      cart.items = [
        ...cart.items.filter(
          (item) => (item.garmet as GarmetDocument)._id != garmetId
        ),
        addedGarmet,
      ]
      return cart.save()
    }
    cart.items.push({ garmet: garmetId, qty: qty })
    return cart.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteFromCart: DeleteFromCart = async (
  userId: string,
  garmetId: string
) => {
  try {
    const cart = await cartModel
      .findOne({ user: userId })
      .populate('user items.garmet', '_id lastName email _ title variant.price')
      .exec()
    if (!cart) {
      throw new Error(`User cart ${userId} not found.`)
    }
    const existingGarmet = cart.items.find((item) => {
      return (item.garmet as GarmetDocument)._id == garmetId
    })
    if (existingGarmet) {
      cart.items = [
        ...cart.items.filter(
          (item) => (item.garmet as GarmetDocument)._id != garmetId
        ),
      ]
      return cart.save()
    } else {
      throw new Error(`Garmet ${garmetId} not found.`)
    }
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteCart = (userId: string) => {
  return cartModel.deleteOne({ user: userId }).exec()
}

export default { findCart, createCart, deleteFromCart, deleteCart }
