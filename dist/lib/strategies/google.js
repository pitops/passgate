const google = require('../adapters/google')

function GoogleStrategy(config) {
  google.init(config)

  return async (req, res) => {
    switch (req.path) {
      case google.authPath:
        res.redirect(google.getAuthUrl())
        break
      case google.callbackPath:
        if (req.query.code) {
          const {tokens} = await google.client.getToken(req.query.code)

          google.client.setCredentials({access_token: tokens.access_token})

          const profile = await google.getProfile()

          google.eventCallbacks.onAuthSuccess(
            {
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              tokenExpiryDate: tokens.expiry_date,
              profile
            },
            () => {
              res.redirect(google.successRedirect)
            }
          )
        }
        break
      case google.revokePath:
        google.eventCallbacks.onAccessRevoke(async refreshToken => {
          try {
            await google.client.revokeToken(refreshToken)
            res.redirect('/')
          } catch (err) {
            res.json({error: err.message})
          }
        })
        break
      default:
        req.passgate.google = google
    }
  }
}

module.exports = GoogleStrategy
