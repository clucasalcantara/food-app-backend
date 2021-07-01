/* eslint-disable camelcase */
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
      data: { results, next_page_token },
    } = await client.get('', {
      params: {
        query: `restaurants+in+${location}`,
        key: GooglePlacesClientConfig.API_KEY,
      },
    })

    console.log({ results, next_page_token })
    console.log(results.map(result => normalizeGooglePlacesResponse(result)))
  },
}
