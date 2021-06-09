/* eslint-disable @typescript-eslint/member-delimiter-style */
import { Document, Schema, model } from 'mongoose'
import { GarmetDocument } from './Garmets'
import { UserDocument } from './User'

type Item = {
  garmet: GarmetDocument | string
  qty: number
}

export interface CartDocument extends Document {
  user: UserDocument | string
  items: Item[]
}

export interface CartDocument extends Document {
  user: UserDocument | string
  items: Item[]
}

const CartModel = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'userModel', required: true },
  items: [
    {
      porduct: {
        type: Schema.Types.ObjectId,
        ref: 'productModel',
        required: true,
      },
      qty: { type: Number, default: 1 },
    },
  ],
})

export default model<CartDocument>('cartModel', CartModel)
