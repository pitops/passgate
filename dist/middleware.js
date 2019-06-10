const strategiesList = Object.freeze({
  google: 'google'
})

const strategies = []

async function Passgate(req, res, next) {
  req.passgate = {}

  for (i = 0; i < strategies.length; i++) {
    await strategies[i](req, res)
  }

  next()
}

Passgate.init = function(strategiesConfig) {
  Object.keys(strategiesConfig).forEach(strategyKey => {
    if (!strategiesList.hasOwnProperty(strategyKey)) return

    strategies.push(
      require(`./lib/strategies/${strategyKey}`)(strategiesConfig[strategyKey])
    )
  })
}

module.exports = Passgate
exports.passgate = Passgate
