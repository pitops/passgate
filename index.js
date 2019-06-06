const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')
const dotenvFilePath = path.resolve(__dirname, `./.env`)

if (fs.existsSync(dotenvFilePath)) {
  dotenv.config({
    path: dotenvFilePath,
    encoding: 'utf8'
  })
}

const app = express()
const port = process.env.PORT || 3000

const passgate = require('./dist/middleware')

passgate.init({
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
})

app.get('/google171ccb7b0cbbac7a.html', function(req, res) {
  res.sendFile(path.join(__dirname + '/google171ccb7b0cbbac7a.html'))
})

function onAuthSuccess(
  {accessToken, refreshToken, tokenExpiryDate, profile},
  done
) {
  console.log({accessToken, refreshToken, tokenExpiryDate, profile})
  done()
}

function onTokensRefresh({access_token, refresh_token, expiry_date}) {
  console.log({access_token, refresh_token, expiry_date})
}

function onAccessRevoke(done) {
  // do database level stuff
  done('1/IeinsMhn7X_vzjik6DNK03ixYf9Ncv50ysHj7nsp0Jw')
}

app.use(passgate)

app.get('/', async (req, res) => {
  const {google} = req.passgate
  const client = google.getClient()

  client.setCredentials({
    access_token: '',
    refresh_token: ''
  })

  try {
    google.instance.options({auth: client})

    const oauth2 = google.instance.oauth2({
      auth: client,
      version: 'v2'
    })

    const res = await oauth2.userinfo.get()
  } catch (err) {
    console.log(err)
  }
  res.send('Hello World!')
})

app.listen(port, () => console.log(`Passgate running on ${port}!`))
