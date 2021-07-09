export const useRestRoutes = (router, passport) => {
  router.get('/auth/facebook', passport.authenticate('facebook'))

  router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
    (ctx, next) => {
      // @TODO: findOrCreate User
      ctx.body = {
        user: ctx.req.user,
      }

      next('/home')
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
