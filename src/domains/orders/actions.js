import logger from 'hoopa-logger'
import { data } from 'rethinkly'
import { v4 as uuidv4 } from 'uuid'
// Helpers
import { decodeUser, verifyAuth } from '../../common/helpers/auth-middleware'
// Rethinkly link instance
import { rethinkly } from '../../services'

/**
 * Get user orders by a restaurant
 * This function is a resolver used by the graphql backend
 * Responsible to retrieve all orders from a restaurant
 * @param {*} _ GQL Response status and default body
 * @param {Object } configParams
 * @return {Object} [Order]
 */
export const getOrdersByRestaurant = async (_, { restaurant_id }, context) => {
  logger.info(`Getting all orders from: ${restaurant_id}`)
  const { user } = decodeUser(context)

  const conn = await rethinkly()
  const result = await data.get(conn, 'orders', {
    restaurant_id,
    user_id: user.id,
  })

  return result
}

/**
 * Get all user orders
 * This function is a resolver used by the graphql backend
 * Responsible to retrieve all orders from a user
 * @param {*} _ GQL Response status and default body
 * @param {Object } configParams
 * @return {Object} [Order]
 */
export const getAllOrders = async (_, _args, context) => {
  const { user } = decodeUser(context)
  logger.info(`Getting all orders for user ${user.id}`)

  const conn = await rethinkly()
  const result = await data.get(conn, 'orders', {
    user_id: user.id,
  })

  return result
}

/**
 * Insert an order
 * This function is a resolver used by the graphql backend
 * Responsible to input an order based on a GQL payload
 * @param {*} _ GQL Response status and default body
 * @param {Object} configParams
 * @return {Object} response
 */
export const insertOrder = async (_, { data: values }, context) => {
  const { user } = decodeUser(context)
  logger.info(`Inserting order ${JSON.stringify(values)}...`)

  const conn = await rethinkly()
  const id = uuidv4()

  const { inserted } = await data.insert(conn, 'orders', {
    id,
    ...values,
    user_id: user.id,
  })

  if (inserted < 1) {
    logger.error(`Error inserting order --data: ${JSON.stringify(values)}`)

    return {
      success: false,
      generated_id: null,
    }
  }

  return { success: true, generated_id: id }
}

/**
 * Delete an order
 * This function is a resolver used by the graphql backend
 * Responsible to delete an order based on a id
 * @param {*} _ GQL Response status and default body
 * @param {String} id
 * @return {Object} response
 */
export const deleteOrder = async (_, { id }, context) => {
  verifyAuth(context)
  logger.info(`Deleting order ${JSON.stringify(id)}...`)

  const conn = await rethinkly()
  const { errors } = await data.remove(conn, 'orders', id)

  if (errors) {
    logger.error(`Error deleting order with --id: ${id}`)

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
export const updateOrder = async (_, { id, data: values }, context) => {
  verifyAuth(context)
  logger.info(`Updating order ${JSON.stringify(id)}...`)

  const conn = await rethinkly()
  const result = await data.get(conn, 'orders', id)

  if (result) {
    const { replaced, errors } = await data.update(conn, 'orders', id, values)

    if (errors) {
      logger.error(
        `Error updating order with --id: ${id} ${JSON.stringify(errors)}`
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
      : logger.error(`Error updating order with --id: ${id}`)
  }
}
