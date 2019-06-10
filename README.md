<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.imgur.com/9f5E2Ud.png" alt="Passgate"></a>
</p>

<h2 align="center">Passgate</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/pitops/passgate.svg)](https://github.com/pitops/passgate/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/pitops/passgate.svg)](https://github.com/pitops/passgate/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

## <p align = "center">💡 Easy third-party authentication middleware for express</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [TODO](../TODO.md)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

Passgate is yet another OAuth2 library heavily inspired from passport with the subtle difference of having everything configured in one place.

The purpose of passgate is to provide a simple and easy unobtrusive way of authenticating with third party OAUTH2 providers. **Right now, it only works with Google OAuth2** but it will be expanded in the near future.

## 🏁 Getting Started <a name = "getting_started"></a>

In general, Passgate is a middleware that gets passed a config object and thats it. It will do the dirty work for you.

### Step 1

First install the npm package

```bash
npm i passgate
```

### Step 2

Create a file named `google.js` and import the following.

```javascript
const GoogleStrategy = {
  google: {
    clientID: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    authPath: '/auth/google',
    callbackPath: '/auth/google/callback',
    revokePath: '/auth/google/revoke',
    callbackURL: `${LOCALHOST_URL}/auth/google/callback`,
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

function onAuthSuccess(
  {accessToken, refreshToken, tokenExpiryDate, profile},
  done
) {
  console.log({accessToken, refreshToken, tokenExpiryDate, profile})
  // do DB stuff
  done() // this must be called after you finish with DB stuff
}

function onTokensRefresh({access_token, refresh_token, expiry_date}) {
  console.log({access_token, refresh_token, expiry_date})
}

function onAccessRevoke(done) {
  // do database level stuff

  done('INSERT REFRESH TOKEN') // here pass the actual refreshToken from your db
}

module.exports = GoogleStrategy
```

The above code can be called a Strategy. In this case for Google. As you can see everything is in once place for authenticating and de-authenticating with Google.

**Make sure you get your CLIENT_ID and CLIENT_SECRET** from [Google dev console](https://console.developers.google.com/)

# Step 3

```javascript
// server.js

const express = require('express')
const passgate = require('passgate')

const GoogleStrategy = require('./google')

const app = express()
const port = process.env.PORT || 3000

passgate.init(GoogleStrategy)

app.use(passgate)

app.get('/', async (req, res) => {
  res.send('Hello world')
})

app.listen(port, () => console.log(`App running on ${port}!`))
```

### Prerequisites

Right now Passgate only works with **Express** so make sure your project supports that.

## TODO

- [x] Add Google OAUTH
- [ ] Add Facebook OAUTH
- [ ] Add Github OAUTH

## ✍️ Authors <a name = "authors"></a>

- [@pitops](https://github.com/pitops) - Idea & Initial work

## Acknowledgements

<a href='https://dryicons.com/icon/gate-icon-11381'> Icon by Dryicons </a>
