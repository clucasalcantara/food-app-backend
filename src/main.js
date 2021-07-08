/**
 * Server instance
 */
import Koa from 'koa'
import cors from 'koa2-cors'
import { ApolloServer } from 'apollo-server-koa'
import logger from 'hoopa-logger'
// GraphQL Definitions
import { appSchema as schema } from './graphql'

const Server = new ApolloServer({
  schema,
  context: ({ ctx: { request } }) => {
    const { header } = request

    return { header }
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
