import {
  getById,
  getByLocation,
  getAll,
  insertRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from './actions'

export default {
  queries: { getById, getByLocation, getAll },
  mutations: { insertRestaurant, deleteRestaurant, updateRestaurant },
}
