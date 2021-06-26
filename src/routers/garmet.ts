import express from 'express'

import {
  createGarmet,
  findOneGarmet,
  deleteGarmet,
  findAllGarmets,
  updateGarmet,
  createReview,
} from '../controllers/garmet'

import { isAuthenticated } from '../middlewares/user.isAuthenticated'
import { isAdmin } from '../middlewares/user.isAdmin'
import { uploadImage } from '../middlewares/multer.garmet'

const router = express.Router()

// Every path we define here will get /api/v1/garmets prefix
router.get('/', findAllGarmets)
router.get('/:productId', findOneGarmet)
router.post('/', isAuthenticated, isAdmin, uploadImage, createGarmet)
router.put('/review/:productId', createReview)
router.put('/:productId', isAuthenticated, isAdmin, updateGarmet)
router.delete('/:productId', isAuthenticated, isAdmin, deleteGarmet)

export default router
