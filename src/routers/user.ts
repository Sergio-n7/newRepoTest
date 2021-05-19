import express from 'express'

import {
  findUserById,
  createUser,
  deleteUser,
  findAllUsers,
  updateUser,
} from '../controllers/user'

const router = express.Router()

router.get('/', findAllUsers)
router.get('/:userId', findUserById)
router.delete('/:userId', deleteUser)
router.put('/:userId', updateUser)
router.post('/', createUser)

export default router
