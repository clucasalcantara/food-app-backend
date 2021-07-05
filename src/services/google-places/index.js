import axios from 'axios'
import logger from 'hoopa-logger'

import { normalizeGooglePlacesResponse } from './helpers'

const placesClient = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/place'
})

export const GooglePlacesClient = {
  getRestaurants: async (cuisine = 'italian', location = 'São Paulo') => {
    try {
      const {
        // @TODO: Update to get next page data: { results, next_page_token }
        data: { results }
      } = await placesClient.get('/textsearch/json', {
        params: {
          query: `${cuisine}+restaurants+in+${location}`,
          key: process.env.GOOGLE_PLACES_API_KEY
        }
      })

      const data = results.map(result =>
        normalizeGooglePlacesResponse(result, cuisine)
      )

      return data
    } catch (error) {
      logger.error(error)
    }
  },
  getRestaurantPhoto: async photoreference => {
    const result = await placesClient.get('/photo', {
      params: {
        key: process.env.GOOGLE_PLACES_API_KEY,
        photoreference,
        maxwidth: 1024
      }
    })

    return result
  }
}
