import logger from 'hoopa-logger'
import { AuthenticationError } from 'apollo-server-koa'
import { verify } from 'jsonwebtoken'

export const verifyAuth = ({ header }) => {
  const { authorization } = header
  try {
    verify(authorization, process.env.API_SECRET)
  } catch (error) {
    const { origin } = header

    logger.error(
      `Unauthenticated request from ${origin} as ${header['user-agent']}`
    )

    throw new AuthenticationError(error)
  }
}
