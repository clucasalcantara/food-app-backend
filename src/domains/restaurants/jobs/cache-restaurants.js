// GooglePlaces Instance
import { GooglePlacesClient } from '../../../services/google-places'

const cuisines = [
  'italian',
  'japanese',
  'burguer',
  'chinese',
  'brazilian',
  'sea food'
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
  const promisesArray = []
  let scopeCuisines = [...cuisines]

  for (const cuisine of extraCuisines) {
    if (!scopeCuisines.includes(cuisine)) {
      scopeCuisines.concat(cuisine)
    }
  }

  scopeCuisines.map(kind => {
    promisesArray.push(GooglePlacesClient.getRestaurants(kind))
  })

  return Promise.all(promisesArray)
}
