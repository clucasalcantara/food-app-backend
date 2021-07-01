/* eslint-disable camelcase */
import logger from 'hoopa-logger'
import { data } from 'rethinkly'
import isAfter from 'date-fns/isAfter'
// Rethinkly link instance
import { rethinkly } from '../../services'
// Zomato Instance
import { ZomatoClient } from '../../services/zomato'
import { GooglePlacesClient } from '../../services/google-places'
// Helpers
import { normalizeZomatoResponse } from '../../helpers'
// Consts
const cache_expiration = Date.now() + 2592000
const now = Date.now()

/**
 * Get restaurant types
 * This function is a resolver used by the graphql backend
 * Responsible to retrieve a GQL payload response based on
 * a query by city id
 * @param {*} _ GQL Response status and default body
 * @param {Object } configParams
 * @return {Array} Restaurant categories
 */
export const getCategoriesByCity = async (_, { city_id }) => {
  logger.info(`Getting restaurant categories with --city_id: ${city_id}`)
  const conn = await rethinkly()
  const dbCategories = await data.get(conn, 'categories')

  if (
    dbCategories.length === 0 ||
    isAfter(dbCategories[0].cache_expiration, now)
  ) {
    logger.info(`Caching restaurant categories for --city_id: ${city_id}`)
    const apiResults = await ZomatoClient.getCategoriesByCity(city_id)
    const toInsert = apiResults.map(({ establishment }) => ({
      ...establishment,
      city_id,
      cache_expiration,
    }))

    const failed = []
    toInsert.map(async record => {
      try {
        await data.insert(conn, 'categories', record)
      } catch (error) {
        logger.info(`Error inserting category ${record.id}`)
        failed.concat(record.id)
      }
    })

    logger.info(
      `Cached ${toInsert.length} restaurant categories for --city_id: ${city_id} with ${failed.length} failures`
    )

    return toInsert
  }

  logger.info(
    `Returning ${dbCategories.length} cached restaurant categories for --city_id: ${city_id}`
  )
  return dbCategories
}

/**
 * Get a restaurant
 * This function is a resolver used by the graphql backend
 * Responsible to retrieve a GQL payload response based on
 * a query by id
 * @param {*} _ GQL Response status and default body
 * @param {Object } configParams
 * @return {Object} Restaurant
 */
export const getById = async (_, { id }) => {
  logger.info(`Getting restaurant with --id: ${id}`)

  const conn = await rethinkly()
  const result = await data.get(conn, 'restaurants', { id })

  logger.info('Here is the restaurant:', JSON.stringify(result))

  return result
}

/**
 * Get a restaurant by city
 * This function is a resolver used by the graphql backend
 * Responsible to retrieve a GQL payload response based on
 * a query by location
 * Avaliable props
 *  address: String
 * city: String
 * city_id: Int
 * country_id: Int
 * latitude: Float
 * locality: String
 * locality_verbose: String
 * longitude: Float
 * zipcode: String
 * @param {*} _ GQL Response status and default body
 * @param {Object} configParams
 * @return {Promise} retrieveData response
 */
export const getByLocation = async (_, { location }) => {
  logger.info(
    `Searching for restaurants in --data: ${JSON.stringify(location)}...`
  )

  const conn = await rethinkly()

  return data.get(conn, 'restaurants', { location })
}

/**
 * Get all restaurants
 * This function is a resolver used by the graphql backend
 * Responsible to retrieve all saved trips
 * @param {*} _ GQL Response status and default body
 * @param {Object} configParams
 * @return {Promise} retrieveData response
 */
export const getAll = async (_, { city, category, provider = 'zomato' }) => {
  logger.info('Getting all restaurants...')
  console.log({ provider })

  const conn = await rethinkly()
  const dbRestaurants = await data.get(conn, 'restaurants')
  const failed = []
  let toInsert = []

  await GooglePlacesClient.getRestaurants()

  if (
    dbRestaurants.length === 0 ||
    isAfter(dbRestaurants[0].cache_expiration, now)
  ) {
    if (provider === 'zomato') {
      const { results_found } = await ZomatoClient.getRestaurants({
        city,
        category,
      })

      const requestsCount = Math.round(results_found / 20)
      logger.info(
        `Caching restaurants for --city_id: ${city}, ${results_found} total, ${requestsCount} requests will be made`
      )

      let start = 0
      let inserted = 0

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i <= requestsCount; i++) {
        const { restaurants } = await ZomatoClient.getRestaurants({
          city,
          category,
          start,
        })

        toInsert = restaurants.map(({ restaurant }) => ({
          ...normalizeZomatoResponse(restaurant),
          city_id: city,
          cache_expiration: Date.now(),
        }))

        toInsert.map(async record => {
          try {
            await data.insert(conn, 'restaurants', record)
          } catch (error) {
            logger.info(`Error inserting restaurant ${record.id}`)
            failed.concat(record.id)
          }
        })

        start += 20
        inserted += restaurants.length

        logger.info(`API Call number ${i}. to insert size: ${inserted}`)
      }
    } else {
      GooglePlacesClient.getRestaurants()
    }

    /* eslint-enable no-await-in-loop */

    logger.info(
      `Cached ${toInsert.length} restaurants for --city: ${city} with ${failed.length} failures`
    )

    return toInsert
  }

  return dbRestaurants
}

/**
 * Insert a restaurant
 * This function is a resolver used by the graphql backend
 * Responsible to input a restaurant based on a GQL payload
 * @param {*} _ GQL Response status and default body
 * @param {Object} configParams
 * @return {Object} response
 */
export const insertRestaurant = async (_, { data: values }) => {
  logger.info(`Inserting restaurant ${JSON.stringify(values)}...`)

  const conn = await rethinkly()
  const { generated_keys = [] } = await data.insert(conn, 'restaurants', values)

  if (generated_keys.length === 0) {
    logger.error(`Error inserting --data: ${JSON.stringify(values)}`)

    return {
      success: false,
      generated_id: null,
    }
  }

  return { success: true, generated_id: generated_keys[0] }
}

/**
 * Delete a restaurant
 * This function is a resolver used by the graphql backend
 * Responsible to delete a restaurant based on a id
 * @param {*} _ GQL Response status and default body
 * @param {String} id
 * @return {Object} response
 */
export const deleteRestaurant = async (_, { id }) => {
  logger.info(`Deleting restaurant ${JSON.stringify(id)}...`)

  const conn = await rethinkly()
  const { errors } = await data.remove(conn, 'restaurants', id)

  if (errors) {
    logger.error(`Error deleting record with --id: ${id}`)

    return {
      success: false,
      removed_id: null,
    }
  }

  return { success: true, removed_id: id }
}

/**
 * Updates a restaurant
 * This function is a resolver used by the graphql backend
 * Responsible to update a restaurant based on a id
 * @param {*} _ GQL Response status and default body
 * @param {String} id
 * @param {Object} values
 * @return {Object} response
 */
export const updateRestaurant = async (_, { id, data: values }) => {
  logger.info(`Updating restaurant ${JSON.stringify(id)}...`)

  const conn = await rethinkly()
  const result = await data.get(conn, 'restaurants', id)

  if (result) {
    const { replaced, errors } = await data.update(
      conn,
      'restaurants',
      id,
      values
    )

    if (errors) {
      logger.error(
        `Error updating record with --id: ${id} ${JSON.stringify(errors)}`
      )

      return {
        success: false,
        updated: false,
      }
    }

    return replaced > 0
      ? {
          success: true,
          updated_id: id,
        }
      : logger.error(`Error updating record with --id: ${id}`)
  }
}
/* eslint-enable camelcase */
