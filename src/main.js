/**
 * Server instance
 */
import Koa from 'koa'
import Router from 'koa-router'
import cors from 'koa2-cors'
import { ApolloServer } from 'apollo-server-koa'
import logger from 'hoopa-logger'
// GraphQL Definitions
import { appSchema as schema } from './graphql'
// Auth Helpers
import { usePassport } from './common/helpers/passport'
import { useRestRoutes } from './domains/auth'

const passport = usePassport()
const port = process.env.PORT || 4005

const Server = new ApolloServer({
  schema,
  context: ({ ctx: { request } }) => {
    const { header } = request

    return { header }
  },
})

const EatList = new Koa()
const router = useRestRoutes(new Router(), passport)

// Apply middlewares
EatList.use(cors())

EatList.use(passport.initialize())
EatList.use(router.routes()).use(router.allowedMethods())

Server.applyMiddleware({ app: EatList, path: '/playground' })

EatList.listen({ port }, () =>
  logger.info(`🚀 Food App API running at http://localhost:${port}`)
)
