import {
  addUser,
  authenticate,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
} from './actions'

export default {
  queries: { getAllUsers, getUserById },
  mutations: { addUser, updateUser, deleteUser, authenticate },
}
