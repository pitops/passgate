const {google} = require('googleapis')

const self = {
  clientID: null,
  clientSecret: null,
  callbackURL: null,
  scope: ['email', 'profile'],
  access_type: null,
  client: null,
  instance: google,
  eventCallbacks: null,
  authPath: null,
  callbackPath: null,
  successRedirect: null,
  failureRedirect: null,

  init: opts => {
    Object.keys(opts).forEach(key => {
      if (!self.hasOwnProperty(key)) return

      if (key !== 'scope') {
        self[key] = opts[key]
      } else {
        Array.isArray(opts.scope)
          ? (self.scope = self.scope.concat(opts.scope))
          : self.scope.push(opts.scope)
      }
    })

    self.getClient({init: true})
  },

  getClient: (opts = {}) => {
    self.client = new google.auth.OAuth2(
      self.clientID,
      self.clientSecret,
      self.callbackURL
    )

    if (!opts.init) {
      self.client.on('tokens', tokens => {
        self.eventCallbacks.onTokensRefresh(tokens)
      })
    }

    return self.client
  },

  getAuthUrl: _ => {
    if (!self.scope) {
      throw new Error('Please provide at least one scope')
    }

    if (!self.access_type) {
      throw new Error('Access type was not provided')
    }

    return self.client.generateAuthUrl({
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
