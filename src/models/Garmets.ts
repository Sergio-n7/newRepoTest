/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type AllGarmets = Document & {
  name: string
  genres: string
  category: string
  brand: string
  size: string
  season: string
  garmetRef: number
}

const garmetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genres: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  season: String,
  garmetRef: {
    type: Number,
    required: true,
    index: true,
  },
})

export default mongoose.model<AllGarmets>('Garmets', garmetSchema)
