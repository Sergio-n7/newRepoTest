import express from 'express'

import {
  findUser,
  createUser,
  deleteUser,
  singInUser,
  findAll,
  updateUser,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.get('/', findAll)
router.get('/:userId', findUser)
router.delete('/:userId', deleteUser)
router.put('/:userId', updateUser)
router.post('/', createUser)
router.post('/signin', singInUser)

export default router
