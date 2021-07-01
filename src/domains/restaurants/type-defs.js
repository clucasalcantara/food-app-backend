export const types = `
  type Restaurant {
    id: String
    name: String
    location: Location
    cuisines: String
    price_range: String
    currency: String
    average_cost: Int
    cache_expiration: Int
    highlights: [String]
    timings: String
    thumb: String
    featured_image: String
    phone: String
    category: String
  }

  type Location {
    address: String
    city: String
    city_id: Int
    country_id: Int
    latitude: Float
    locality: String
    locality_verbose: String
    longitude: Float
    zipcode: String
  }

  input LocationType {
    address: String
    city: String
    city_id: Int
    country_id: Int
    latitude: Float
    locality: String
    locality_verbose: String
    longitude: Float
    zipcode: String
  }

  type category {
    id: Int
    name: String
  }

  input RestaurantInput {
    name: String
    city: String
  }
`

export const queries = `
  getById(id: String): Restaurant
  getByLocation(location: LocationType): [Restaurant]
  getAll(city: Int, category: Int): [Restaurant]
`

export const mutations = `
  insertRestaurant(data: RestaurantInput): insertResponse
  deleteRestaurant(id: String): removeResponse
  updateRestaurant(id: String, data: RestaurantInput): updateResponse
`
