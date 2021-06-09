/* eslint-disable @typescript-eslint/member-delimiter-style */

import { Document, Schema, model } from 'mongoose'

export interface UserDocument extends Document {
  firstName: string
  lastName: string
  email: string
  age: number
  password: string
  isAdmin: boolean
}

const UserModel = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlenght: 8,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default model<UserDocument>('userModel', UserModel)
