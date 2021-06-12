import express from 'express'

import {
  createGarmet,
  findGarmet,
  deleteGarmet,
  findAll,
  updateGarmet,
  createReview,
} from '../controllers/garmet'

import { isAuthenticated } from '../middlewares/user.isAuthenticated'
import { isAdmin } from '../middlewares/user.isAdmin'
import { uploadImage } from '../middlewares/multer.garmet'

const router = express.Router()

// Every path we define here will get /api/v1/garmets prefix
router.get('/', findAll)
router.get('/:garmetId', findGarmet)
router.put('/:garmetId', isAuthenticated, isAdmin, updateGarmet)
router.delete('/:garmetId', isAuthenticated, isAdmin, deleteGarmet)
router.post('/', isAuthenticated, isAdmin, uploadImage, createGarmet)
router.put('/review/:garmetId', createReview)

export default router
