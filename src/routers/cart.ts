import express from 'express'

import {
  findCart,
  createCart,
  deleteFromCart,
  deleteCart,
} from '../controllers/cart'

const router = express.Router()

// Every path we define here will get /api/v1/cart prefix
router.get('/:userId', findCart)
router.post('/:userId', createCart)
router.put('/:userId/:garmetId', deleteFromCart)
router.delete('/:userId', deleteCart)

export default router
