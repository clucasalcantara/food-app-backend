import {
  getById,
  getByLocation,
  getCategoriesByCity,
  getAll,
  insertRestaurant,
  deleteRestaurant,
  updateRestaurant,
} from './actions'

export default {
  queries: { getById, getByLocation, getCategoriesByCity, getAll },
  mutations: { insertRestaurant, deleteRestaurant, updateRestaurant },
}
