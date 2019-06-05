const ngrok = require('ngrok')
const path = require('path')
const fs = require('fs')
const dotenvFilePath = path.resolve(__dirname, `./.env`)
const dotenv = require('dotenv')

if (fs.existsSync(dotenvFilePath)) {
  dotenv.config({
    path: dotenvFilePath,
    encoding: 'utf8'
  })
}

ngrok
  .connect({
    addr: process.env.PORT,
    authtoken: process.env.NGROK_AUTH_TOKEN,
    subdomain: process.env.NGROK_SUBDOMAIN,
    region: process.env.NGROK_REGION
  })
  .then(url => {
    console.log(`👩🏻‍💻  Webhook URL for Google OAUTH2: ${url}/auth/google`)
    console.log(`💳  App URL to see the demo in your browser: ${url}/`)
  })
  .catch(err => {
    if (err.code === 'ECONNREFUSED') {
      console.log(`⚠️  Connection refused at ${err.address}:${err.port}`)
    } else {
      console.log(`⚠️  ${JSON.stringify(err)}`)
    }
    process.exit(1)
  })
