import express from 'express'

import {
  findUserById,
  createUser,
  deleteUser,
  singInUser,
  findAllUsers,
  updateUser,
} from '../controllers/user'

const router = express.Router()

// Every path we define here will get /api/v1/users prefix
router.get('/', findAllUsers)
router.get('/:userId', findUserById)
router.delete('/:userId', deleteUser)
router.put('/:userId', updateUser)
router.post('/', createUser)
router.post('/signin', singInUser)

export default router
