export const types = `
  type Restaurant {
    id: String
    name: String
    location: String
    cuisine: String
    price_range: String
    user_rating: String
    currency: String
    featured_image: String
    geometry: Geometry
    opening_hours: [String]
    website: String
    formatted_phone_number: String
  }

  type Geometry {
    location: Location
  }

  type Location {
    lat: Float
    lgn: Float
  }

  input RestaurantInput {
    name: String
    location: String
    cuisine: String
    price_range: String
    user_rating: String
    currency: String
    featured_image: String
    opening_hours: [String]
    website: String
    formatted_phone_number: String
  }
`

export const queries = `
  getById(id: String): Restaurant
  getAllRestaurants(page: Int, pageSize: Int): [Restaurant]
  getByCuisine(cuisine: String): [Restaurant]
  searchRestaurants(filter: RestaurantInput): [Restaurant]
`

export const mutations = `
  insertRestaurant(data: RestaurantInput): insertResponse
  deleteRestaurant(id: String): removeResponse
  updateRestaurant(id: String, data: RestaurantInput): updateResponse
`
