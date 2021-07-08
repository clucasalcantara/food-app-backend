export const useRestRoutes = (router, passport) => {
  router.get(
    '/auth/facebook',
    passport.authenticate('facebook', {
      successRedirect: '/facebook/success',
      failureRedirect: '/facebook/failure',
    })
  )

  return router
}
