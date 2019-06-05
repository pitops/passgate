const google = require('./lib/google')

const middleware = async function (req, res, next, config, callback) {
  google.init(config.google)

  switch (req.path) {
    case config.google.authPath:
      res.redirect(google.getAuthUrl())
      break
    case config.google.callbackPath:
      if (req.query.code) {
        const { tokens } = await google.client.getToken(req.query.code)

        google.client.setCredentials({ access_token: tokens.access_token })

        const profile = await google.getProfile()

        config.google.eventCallbacks.onAuthSuccess(
          {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpiryDate: tokens.expiry_date,
            profile
          },
          () => {
            res.redirect(config.google.successRedirect)
          }
        )
      }
    case config.google.revokePath:
      config.google.eventCallbacks.onAccessRevoke(async refreshToken => {
        try {
          await google.client.revokeToken(refreshToken)
          res.redirect('/')
        } catch (err) {
          console.log({ error: err.message })
          res.json({ error: err.message })
        }
      })
    default:
      req.passgate = {
        google
      }
      next()
  }
}

module.exports = middleware
