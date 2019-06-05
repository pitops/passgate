const { google } = require('googleapis')

const self = {
  clientID: null,
  clientSecret: null,
  callbackURL: null,
  scope: ['email', 'profile'],
  access_type: null,
  client: null,
  instance: google,
  eventCallbacks: null,

  init: opts => {
    Object.keys(opts).forEach(key => {
      if (self.hasOwnProperty(key)) {
        if (key === 'scope') {
          if (Array.isArray(opts.scope)) {
            self.scope.concat(opts.scope)
          } else {
            self.scope.push(opts.scope)
          }
        } else {
          self[key] = opts[key]
        }
      }
    })

    self.getClient()
  },

  getClient: _ => {
    self.client = new google.auth.OAuth2(
      self.clientID,
      self.clientSecret,
      self.callbackURL
    )

    self.client.on('tokens', tokens => {
      self.eventCallbacks.onTokensRefresh(tokens)
    })

    return self.client
  },

  getAuthUrl: _ => {
    if (!self.scope) {
      throw new Error('Please provide at least one scope')
    }

    if (!self.access_type) {
      throw new Error('Access type was not provided')
    }

    return self.getClient().generateAuthUrl({
      access_type: self.access_type,
      scope: self.scope
    })
  },

  getProfile: async _ => {
    const oauth2 = google.oauth2({
      auth: self.client,
      version: 'v2'
    })

    const res = await oauth2.userinfo.get()

    return {
      email: res.data.email,
      name: res.data.name,
      picture: res.data.picture
    }
  }
}

module.exports = self
