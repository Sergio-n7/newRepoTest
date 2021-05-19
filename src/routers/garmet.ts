import express from 'express'

import {
  createGarmet,
  findById,
  deleteGarmet,
  findAll,
  updateGarmet,
} from '../controllers/garmet'

const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
router.get('/', findAll)
router.get('/:garmetId', findById)
router.put('/:garmetId', updateGarmet)
router.delete('/:garmetId', deleteGarmet)
router.post('/', createGarmet)

export default router
