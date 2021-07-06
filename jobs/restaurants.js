import logger from 'hoopa-logger'
import { data } from 'rethinkly'
// GooglePlaces Instance
import { GooglePlacesClient } from '../src/services/google-places'
// Rethinkly link instance
import { rethinkly } from '../src/services'
// Consts
const cache_expiration = Date.now() + 2592000

const cuisines = [
  'italian',
  'japanese',
  'burguer',
  'chinese',
  'brazilian',
  'sea food',
]

/**
 * Cache data
 * This function is a helper to extract async block
 * responsible to cache restaurants
 * @param {*} _ GQL Response status and default body
 * @param {Object} configParams
 * @return {boolean} status
 */
export const cacheAllRestaurants = async (extraCuisines = []) => {
  logger.info(`cacheAllRestaurantsJob - Started...`)

  const conn = await rethinkly()
  const scopeCuisines = [...cuisines]

  for (const cuisine of extraCuisines) {
    if (!scopeCuisines.includes(cuisine)) {
      scopeCuisines.concat(cuisine)
    }
  }

  logger.info(`Built cuisines types...`)

  scopeCuisines.map(async (kind, cousinesIndex) => {
    const results = await GooglePlacesClient.getRestaurants(kind)

    results.map(async (establishment, establishmentIndex) => {
      const isLastCuisineType = cousinesIndex === scopeCuisines.length - 1
      const isLastEstablishment = establishmentIndex === results.length - 1
      const establishmentData = await establishment

      const record = {
        ...establishmentData,
        cache_expiration,
      }

      try {
        await data.insert(conn, 'restaurants', record)
        logger.info(`Successfully inserted restaurant ${record.id}`)

        if (isLastCuisineType && isLastEstablishment) {
          logger.info(`cacheAllRestaurantsJob - Ended...`)
          /* eslint-disable unicorn/no-process-exit */
          process.exit()
        }
      } catch (error) {
        console.log({ error })
        logger.error(`Error inserting restaurant ${record.id}`)
      }
    })
  })
}

/* eslint-enable unicorn/no-process-exit */
