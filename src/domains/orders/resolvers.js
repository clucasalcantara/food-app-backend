import {
  getAllOrders,
  getOrdersByRestaurant,
  insertOrder,
  deleteOrder,
  updateOrder,
} from './actions'

export default {
  queries: { getAllOrders, getOrdersByRestaurant },
  mutations: { insertOrder, deleteOrder, updateOrder },
}
