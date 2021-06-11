/* eslint-disable @typescript-eslint/member-delimiter-style */
import { Document, Schema, model } from 'mongoose'

export interface ReviewDocument extends Document {
  name: string
  comment: string
  rating: number
}

export interface GarmetDocument extends Document {
  name: string
  description: string
  category: string
  stock: number
  variant: {
    price: number
    color: string
    size: string
  }
  image: string
  totalRating: number
  reviews: ReviewDocument[]
}

const GarmetModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
    required: true,
  },
  variant: {
    price: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  image: {
    type: String,
  },
  totalRating: {
    type: Number,
    default: 0,
    required: true,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        required: true,
      },
    },
  ],
})

export default model<GarmetDocument>('garmetModel', GarmetModel)
