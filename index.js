const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')
const dotenvFilePath = path.resolve(__dirname, `./.env`)
const passgate = require('./example/passgate')

if (fs.existsSync(dotenvFilePath)) {
  dotenv.config({
    path: dotenvFilePath,
    encoding: 'utf8'
  })
}

const app = express()
const port = process.env.PORT || 3000

app.get('/google171ccb7b0cbbac7a.html', function (req, res) {
  res.sendFile(path.join(__dirname + '/google171ccb7b0cbbac7a.html'))
})

app.use(passgate)

app.get('/', async (req, res) => {
  const { google } = req.passgate
  const client = google.getClient()

  client.setCredentials({
    access_token: '',
    refresh_token: ''
  })

  try {
    google.instance.options({ auth: client })

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
