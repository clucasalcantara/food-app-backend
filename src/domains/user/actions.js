/* eslint-disable camelcase */
import logger from 'hoopa-logger'
import { data } from 'rethinkly'
import { rethinkly } from '../../services'

/**
 * Insert an user
 * This function is a resolver used by the graphql backend
 * Responsible to input a user based on a GQL payload
 * @param {*} _ GQL Response status and default body
 * @param {Object} configParams
 * @return {Object} response
 */
export const addUser = async (_, { data: values }) => {
  logger.info(`Inserting user with payload: ${JSON.stringify(values)}...`)

  const conn = await rethinkly()
  const { generated_keys = [] } = await data.insert(conn, 'users', values)

  if (generated_keys.length === 0) {
    logger.error(`Error inserting --data: ${JSON.stringify(values)}`)

    return {
      success: false,
      generated_id: null,
    }
  }

  logger.info(`User inserted with id ${generated_keys[0]}...`)
  return { success: true, generated_id: generated_keys[0] }
}

/**
 * Delete an user
 * This function is a resolver used by the graphql backend
 * Responsible to delete an user based on a id
 * @param {*} _ GQL Response status and default body
 * @param {String} id
 * @return {Object} response
 */
export const deleteUser = async (_, { id }) => {
  logger.info(`Started user ${JSON.stringify(id)} removal...`)

  const conn = await rethinkly()
  const { errors } = await data.remove(conn, 'users', id)

  if (errors) {
    logger.error(`Error deleting users with --id: ${id}`)

    return {
      success: false,
      removed_id: null,
    }
  }

  return { success: true, removed_id: id }
}

/**
 * Updates an user
 * This function is a resolver used by the graphql backend
 * Responsible to update an user based on a id
 * @param {*} _ GQL Response status and default body
 * @param {String} id
 * @param {Object} values
 * @return {Object} response
 */
export const updateUser = async (_, { id, data: values }) => {
  logger.info(`Updating user ${JSON.stringify(id)}...`)

  const conn = await rethinkly()
  const result = await data.get(conn, 'users', id)

  if (result) {
    const { errors } = await data.update(conn, 'users', id, values)

    if (errors) {
      logger.error(
        `Error updating user with --id: ${id} ${JSON.stringify(errors)}`
      )

      return {
        success: false,
        updated: false,
      }
    }

    return {
      success: true,
      updated_id: id,
    }
  }
}

/**
 * Get all users
 * This function is a resolver used by the graphql backend
 * Responsible to retrieve all users
 * @param {*} _ GQL Response status and default body
 * @param {Object} configParams
 * @return {Promise} retrieveData response
 */
export const getAllUsers = async () => {
  logger.info('Getting all users...')

  const conn = await rethinkly()
  const users = await data.get(conn, 'users')

  return users
}

/**
 * Get an user
 * This function is a resolver used by the graphql backend
 * Responsible to retrieve a GQL payload response based on
 * a query by id
 * @param {*} _ GQL Response status and default body
 * @param {Object } configParams
 * @return {Object} Customer
 */
export const getUserById = async (_, { id }) => {
  logger.info(`Getting user with --id: ${id}`)

  const conn = await rethinkly()
  const result = await data.get(conn, 'user', { id })

  logger.info('Here is the user:', JSON.stringify(result))

  return result
}
/* eslint-enable camelcase */
