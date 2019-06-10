const dotenvFilePath = require('dotenv').config()
const passgate = require('../dist/middleware')

const config = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authPath: '/auth/google',
    callbackPath: '/auth/google/callback',
    revokePath: '/auth/google/revoke',
    callbackURL: `${process.env.NGROK_URL}/auth/google/callback`,
    scope: ['https://www.googleapis.com/auth/youtube'],
    access_type: 'offline',
    successRedirect: '/',
    failureRedirect: '/login',
    eventCallbacks: {
      onAuthSuccess,
      onTokensRefresh,
      onAccessRevoke
    }
  }
}

function onAuthSuccess (
  { accessToken, refreshToken, tokenExpiryDate, profile },
  done
) {
  console.log({ accessToken, refreshToken, tokenExpiryDate, profile })
  done()
}

function onTokensRefresh ({ access_token, refresh_token, expiry_date }) {
  console.log({ access_token, refresh_token, expiry_date })
}

function onAccessRevoke (done) {
  // do database level stuff
  done('refreshToken')
}

passgate.init(config)

module.exports = passgate
exports.passgate = passgate
