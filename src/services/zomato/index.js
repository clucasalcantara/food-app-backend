/* eslint-disable camelcase */
import axios from 'axios'

const zomatoConfig = {
  API_KEY: process.env.ZOMATO_API_KEY,
}

const client = axios.create({
  baseURL: 'https://developers.zomato.com/api/v2.1/',
  headers: {
    'user-key': zomatoConfig.API_KEY,
  },
})

export const ZomatoClient = {
  getCategoriesByCity: async (city = 67) => {
    const {
      data: { establishments },
    } = await client.get('/establishments', {
      params: {
        city_id: city,
      },
    })

    return establishments
  },
  getRestaurants: async ({ city, category = 16, start }) => {
    const {
      data: { restaurants, results_found, results_start, results_shown },
    } = await client.get('/search', {
      params: {
        entity_id: city,
        entity_type: 'city',
        establishment_type: category,
        start,
      },
    })

    return { restaurants, results_found, results_start, results_shown }
  },
}
