import mongoose, { Document } from 'mongoose'
import { TRUE } from 'node-sass'

export type AllGarmets = Document & {
  name: string;
  genres: string;
  category: string;
  brand: string;
  size: string;
  season: string;
  collection: number;
  ref: number;
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
  collection: Number,
  ref: {
    type: Number,
    required: true,
    index: true,
  },
})
