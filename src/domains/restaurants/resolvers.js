import {
  getById,
  getAllRestaurants,
  insertRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from './actions'

export default {
  queries: { getById, getAllRestaurants },
  mutations: { insertRestaurant, deleteRestaurant, updateRestaurant },
}
