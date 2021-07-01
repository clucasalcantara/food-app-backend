import { gql } from 'apollo-server-koa'

export default gql`
  type Restaurant {
    id: String
    name: String
    location: Location
    cuisines: String
    price_range: Int
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

  type insertResponse {
    generated_id: String
    success: Boolean
  }

  type removeResponse {
    removed_id: String
    success: Boolean
  }

  type updateResponse {
    updated_id: String
    success: Boolean
  }

  type Query {
    getById(id: String): Restaurant
    getByLocation(location: LocationType): [Restaurant]
    getCategoriesByCity(city_id: Int): [category]
    getAll(city: Int, category: Int, provider: String): [Restaurant]
  }

  type Mutation {
    insertRestaurant(data: RestaurantInput): insertResponse
    deleteRestaurant(id: String): removeResponse
    updateRestaurant(id: String, data: RestaurantInput): updateResponse
  }
`
