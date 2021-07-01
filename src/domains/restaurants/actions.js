import logger from 'hoopa-logger'
import { data } from 'rethinkly'
import { v4 as uuidv4 } from 'uuid'
import isAfter from 'date-fns/isAfter'
// Rethinkly link instance
import { rethinkly } from '../../services'
// GooglePlaces Instance
import { GooglePlacesClient } from '../../services/google-places'
// Consts
const cache_expiration = Date.now() + 2592000
const now = Date.now()

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
// export const getAll = async (_, { city, category }) => {
export const getAll = async () => {
  logger.info('Getting all restaurants...')

  const conn = await rethinkly()
  const dbRestaurants = await data.get(conn, 'restaurants')
  const failed = []

  if (
    dbRestaurants.length === 0 ||
    isAfter(now, dbRestaurants[0].cache_expiration)
  ) {
    logger.info('Caching restaurants...')
    const apiResults = await GooglePlacesClient.getRestaurants()

    apiResults.map(async establishment => {
      const record = {
        ...establishment,
        cache_expiration,
      }

      try {
        await data.insert(conn, 'restaurants', record)
      } catch (error) {
        console.log({ error })
        logger.info(`Error inserting restaurant ${record.id}`)
        failed.concat(record.id)
      }
    })

    logger.info(
      `Cached ${apiResults.length} restaurants with ${failed.length} failures`
    )

    return apiResults
  }

  logger.info('Using cached information...')

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
  const id = uuidv4()

  const { inserted } = await data.insert(conn, 'restaurants', {
    id,
    ...values,
  })

  if (inserted < 1) {
    logger.error(`Error inserting --data: ${JSON.stringify(values)}`)

    return {
      success: false,
      generated_id: null,
    }
  }

  return { success: true, generated_id: id }
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
