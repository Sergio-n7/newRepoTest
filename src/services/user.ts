import User, { AllUsers } from '../models/User'

// Service create
function createUser(user: AllUsers): Promise<AllUsers> {
  return user.save()
}

// Service findById
function findUserById(userId: string): Promise<AllUsers> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found.`)
      }
      return user
    })
}

// Service FindAllUsers
function findAllUsers(): Promise<AllUsers[]> {
  return User.find().sort({ firstname: 1, age: 1 }).exec()
}

// Service Update
function updateUser(
  userId: string,
  updateUser: Partial<AllUsers>
): Promise<AllUsers> {
  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        throw new Error(`User ${userId} not found.`)
      }
      if (updateUser.firstname) {
        user.firstname = updateUser.firstname
      }
      if (updateUser.lastname) {
        user.lastname = updateUser.lastname
      }
      if (updateUser.age) {
        user.age = updateUser.age
      }
      if (updateUser.password) {
        user.password = updateUser.password
      }
      if (updateUser.email) {
        user.email = updateUser.email
      }
      return user.save()
    })
}

// Service Delete
function deleteUser(userId: string): Promise<AllUsers | null> {
  return User.findByIdAndDelete(userId).exec()
}

export default {
  createUser,
  updateUser,
  deleteUser,
  findAllUsers,
  findUserById,
}
