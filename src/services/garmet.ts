/* eslint-disable @typescript-eslint/member-delimiter-style */
import GarmetModel, { GarmetDocument, ReviewDocument } from '../models/Garmets'

type InputData = {
  name: string
  description: string
  category: string
  stock: number
  price: number
  color: string
  size: string
  totalRating: number
}

type FindAllType = () => Promise<GarmetDocument[]>
type FindOneGarmetType = (garmetId: string) => Promise<GarmetDocument>
type CreateGarmetType = (inputGarmet: GarmetDocument) => Promise<GarmetDocument>
type UpdateGarmetType = (
  garmetId: string,
  inputData: InputData
) => Promise<GarmetDocument>
type CreateReviewType = (
  garmetId: string,
  inputData: ReviewDocument
) => Promise<GarmetDocument>
type DeleteGarmetType = (garmetId: string) => Promise<GarmetDocument | null>

const findAllGarmets: FindAllType = () => {
  return GarmetModel.find().exec()
}

const findOneGarmet: FindOneGarmetType = async (garmetId: string) => {
  try {
    const garmet = await GarmetModel.findById(garmetId).exec()
    if (!garmet) {
      throw new Error(`Garmet ${garmetId} not found`)
    }
    return garmet
  } catch (error) {
    throw new Error(error.message)
  }
}

const createGarmet: CreateGarmetType = (inputGarmet: GarmetDocument) => {
  return inputGarmet.save()
}

const createReview: CreateReviewType = async (
  garmetId: string,
  inputData: ReviewDocument
) => {
  try {
    const garmet = await GarmetModel.findById(garmetId).exec()

    if (!garmet) {
      throw new Error(`Garmet ${garmetId} not found`)
    }

    const review: Partial<ReviewDocument> = {
      name: inputData.name,
      comment: inputData.comment,
      rating: inputData.rating,
    }

    garmet.reviews.push(review as ReviewDocument)
    garmet.totalRating =
      garmet.reviews.reduce((a, b) => b.rating + a, 0) / garmet.reviews.length

    return garmet.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

const updateGarmet: UpdateGarmetType = async (
  garmetId: string,
  inputData: InputData
) => {
  try {
    const garmet = await GarmetModel.findOne({ _id: garmetId }).exec()

    if (!garmet) {
      throw new Error(`Garmet ${garmetId} not found`)
    }
    if (inputData.name) {
      garmet.name = inputData.name
    }
    if (inputData.description) {
      garmet.description = inputData.description
    }
    if (inputData.category) {
      garmet.category = inputData.category
    }
    if (inputData.stock) {
      garmet.stock = +inputData.stock
    }
    if (inputData.price) {
      garmet.variant.price = +inputData.price
    }
    if (inputData.color) {
      garmet.variant.color = inputData.color
    }
    if (inputData.price) {
      garmet.variant.size = inputData.size
    }
    return garmet.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteGarmet: DeleteGarmetType = (garmetId: string) => {
  return GarmetModel.findByIdAndDelete(garmetId).exec()
}

export default {
  findAllGarmets,
  findOneGarmet,
  createGarmet,
  createReview,
  updateGarmet,
  deleteGarmet,
}
