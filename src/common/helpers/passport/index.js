import passport from 'koa-passport'
import Strategy from 'passport-facebook'

export const usePassport = () => {
  passport.serializeUser((user, done) => done(null, user))

  passport.deserializeUser((user, done) => done(null, user))

  passport.use(
    new Strategy(
      {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: '/auth/facebook',
        profileFields: ['email', 'name'],
      },
      (accessToken, refreshToken, profile, done) => {
        const { email, first_name, last_name } = profile._json

        const userData = {
          email,
          firstName: first_name,
          lastName: last_name,
          accessToken,
          refreshToken,
        }

        console.log({ userData })
        done(null, profile)
      }
    )
  )

  return passport
}
