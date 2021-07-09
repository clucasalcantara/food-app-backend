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
        callbackURL:
          'https://api.foodapp.caioalcantara.dev/auth/facebook/callback',
        profileFields: ['email', 'name'],
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, { profile, accessToken, refreshToken })
      }
    )
  )

  return passport
}
