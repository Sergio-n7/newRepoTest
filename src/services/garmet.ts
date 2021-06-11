/* eslint-disable @typescript-eslint/member-delimiter-style */
import GarmetModel, { GarmetDocument, ReviewDocument } from '../models/Garmets'

type InputData = {
  title: string
  description: string
  category: string
  countInStock: number
  price: number
  color: string
  size: string
  generalRating: number
}

type FindAll = () => Promise<GarmetDocument[]>

type FindGarmet = (garmetId: string) => Promise<GarmetDocument>

type CreateGarmet = (inputGarmet: GarmetDocument) => Promise<GarmetDocument>

type UpdateGarmet = (
  garmetId: string,
  inputData: InputData
) => Promise<GarmetDocument>

type CreateReview = (
  garmetId: string,
  inputData: ReviewDocument
) => Promise<GarmetDocument>

type DeleteGarmet = (garmetId: string) => Promise<GarmetDocument | null>

const findAll: FindAll = () => {
  return GarmetModel.find().exec()
}

const findGarmet: FindGarmet = async (garmetId: string) => {
  try {
    const garmet = await GarmetModel.findById(garmetId).exec()
    if (!garmet) {
      throw new Error(`Garmet ${garmetId} not found.`)
    }
    return garmet
  } catch (error) {
    throw new Error(error.message)
  }
}

const createGarmet: CreateGarmet = (inputGarmet: GarmetDocument) => {
  return inputGarmet.save()
}

const updateGarmet: UpdateGarmet = async (
  garmetId: string,
  inputData: InputData
) => {
  try {
    const garmet = await GarmetModel.findOne({ _id: garmetId }).exec()
    if (!garmet) {
      throw new Error(`Garmet ${garmetId} not found.`)
    }
    if (inputData.title) {
      garmet.title = inputData.title
    }
    if (inputData.description) {
      garmet.description = inputData.description
    }
    if (inputData.category) {
      garmet.category = inputData.category
    }
    if (inputData.countInStock) {
      garmet.countInStock = inputData.countInStock
    }
    if (inputData.price) {
      garmet.variant.price = +inputData.price
    }
    if (inputData.color) {
      garmet.variant.color = inputData.color
    }
    if (inputData.size) {
      garmet.variant.size = inputData.size
    }
    return garmet.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

const createReview: CreateReview = async (
  garmetId: string,
  inputData: ReviewDocument
) => {
  try {
    const garmet = await GarmetModel.findById(garmetId).exec()
    if (!garmet) {
      throw new Error(`Garmet ${garmetId} not found.`)
    }
    const review: Partial<ReviewDocument> = {
      name: inputData.name,
      comment: inputData.comment,
      rating: inputData.rating,
    }
    garmet.reviews.push(review as ReviewDocument)
    garmet.generalRating =
      garmet.reviews.reduce((a, b) => b.rating + a, 0) / garmet.reviews.length
    return garmet.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteGarmet: DeleteGarmet = (garmetId: string) => {
  return GarmetModel.findByIdAndDelete(garmetId).exec()
}

export default {
  findAll,
  findGarmet,
  createGarmet,
  updateGarmet,
  createReview,
  deleteGarmet,
}
