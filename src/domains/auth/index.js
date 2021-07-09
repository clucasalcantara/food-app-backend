import { data } from 'rethinkly'
import { v4 as uuidv4 } from 'uuid'
import { sign } from 'jsonwebtoken'
import logger from 'hoopa-logger'

import { rethinkly } from '../../services'

export const useRestRoutes = (router, passport) => {
  router.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' })
  )

  router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
    async ctx => {
      // @TODO: findOrCreate User
      // @TODO: Fetch a better user photo
      const conn = await rethinkly()
      const {
        req: {
          user: { profile, accessToken },
        },
      } = ctx
      const [databaseUser] = await data.get(conn, 'users', {
        email: profile.email,
      })

      if (!databaseUser) {
        const id = uuidv4()
        const {
          picture: {
            data: { url },
          },
        } = profile

        const userData = {
          id,
          provider: 'facebook',
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          provider_id: profile.id,
          profile_pic: url || '',
          provider_token: accessToken,
        }

        const { inserted } = await data.insert(conn, 'users', userData)

        if (inserted < 1) {
          logger.error(`Error inserting --user: ${JSON.stringify(userData)}`)

          throw new Error(`Error creating user ${id}`)
        }

        const token = sign({ user: userData }, process.env.API_SECRET)

        ctx.body = {
          status: 200,
          message: 'User authenticated succesfully!',
          token,
        }
      }
    }
  )

  router.get('/auth/failure', ctx => {
    ctx.body = {
      status: 403,
      message: 'Login attempt failed',
    }
  })

  return router
}
