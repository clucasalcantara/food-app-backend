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
  Query: { getById, getByLocation, getCategoriesByCity, getAll },
  Mutation: { insertRestaurant, deleteRestaurant, updateRestaurant },
}
