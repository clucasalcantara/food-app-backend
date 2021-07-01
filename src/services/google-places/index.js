import axios from 'axios'
import { normalizeGooglePlacesResponse } from '../../helpers'

const GooglePlacesClientConfig = {
  API_KEY: process.env.GOOGLE_PLACES_API_KEY,
}

const client = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
})

export const GooglePlacesClient = {
  getRestaurants: async (location = 'São Paulo') => {
    const {
      // @TODO: Update to get next page data: { results, next_page_token }
      data: { results },
    } = await client.get('', {
      params: {
        query: `restaurants+in+${location}`,
        key: GooglePlacesClientConfig.API_KEY,
      },
    })

    return results.map(result => normalizeGooglePlacesResponse(result))
  },
}
