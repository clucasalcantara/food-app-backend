export const types = `
  type Order {
    id: String
    name: String
    restaurant_id: String
    user_id: String
    price: String
    rating: String
    Images: [String]
  }
  
  input OrderInput {
    id: String
    name: String
    restaurant_id: String
    price: String
    rating: String
    Images: [String]
  }
`

export const queries = `
  getAllOrders(userId: String): [Order]
  getOrdersByRestaurant(restaurant_id: String): [Order]
`

export const mutations = `
  inserOrder(data: OrderInput): insertResponse
  deleteOrder(orderId: String): removeResponse
  updateOrder(id: String, data: OrderInput): updateResponse
`
