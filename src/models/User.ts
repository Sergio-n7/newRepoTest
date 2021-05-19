/* eslint-disable @typescript-eslint/member-delimiter-style */

import mongoose, { Document, Schema } from 'mongoose'

export type ItemsInCart = {
  name: string
  quantity: number
}

export type AllUsers = Document & {
  firstname: string
  lastname: string
  email: string
  password: string | number
  age: number
  itemsInCart: ItemsInCart[]
}

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [4, 'Too few characters'],
    maxlength: [12, 'Too many characters'],
  },
  age: {
    type: Number,
    min: [18, 'Too joung to have a profile in this site'],
    required: true,
  },
  itemsInCart: [
    {
      name: {
        type: Schema.Types.ObjectId,
        ref: 'Garmet',
      },
      quantity: Number,
    },
  ],
})

export default mongoose.model<AllUsers>('User', userSchema)
