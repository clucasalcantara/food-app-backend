import {
  getById,
  getAllRestaurants,
  insertRestaurant,
  deleteRestaurant,
  updateRestaurant,
  searchRestaurants,
} from './actions'

export default {
  queries: { getById, getAllRestaurants, searchRestaurants },
  mutations: { insertRestaurant, deleteRestaurant, updateRestaurant },
}
