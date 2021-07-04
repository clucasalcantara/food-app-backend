/**
 * Server instance
 */
import Koa from 'koa'
import cors from 'koa2-cors'
import { ApolloServer, AuthenticationError } from 'apollo-server-koa'
import logger from 'hoopa-logger'
import { verify } from 'jsonwebtoken'
// GraphQL Definitions
import { appSchema as schema } from './graphql'

const Server = new ApolloServer({
  schema,
  context: ({ ctx: { request } }) => {
    const {
      header: { authorization },
    } = request

    try {
      verify(authorization, process.env.API_SECRET)
    } catch (error) {
      const { origin } = request

      logger.error(
        `Unauthenticated request from ${origin}, user-agent: ${request.header['user-agent']}`
      )

      throw new AuthenticationError(error)
    }
  },
})

const EatList = new Koa()

const port = process.env.PORT || 4005
const { graphqlPath } = Server

EatList.use(cors())
Server.applyMiddleware({ app: EatList })

EatList.listen({ port }, () =>
  logger.info(
    `🚀 Food App API running at http://localhost:${port}${graphqlPath}`
  )
)
