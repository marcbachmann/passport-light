//
// Passport strategy execution
//
// var Strategy = require('./some-strategy')
// var strategy = new Strategy({clientId: 'foo'}, function (user, done) {
//   done(null, user)
// })

// var passport = require('passport-light')
// function exampleController (req, res, next) {
//   passport.authenticate(strategy, {
//     req: req,
//     redirect: function (url, status) { res.redirect(url, status) },
//     success: function (user, info) { res.send(user) },
//     pass: function () { res.sendStatus(401) },
//     fail: function (challenge, status) { res.status(status).send(challenge) },
//     error: function (err) { res.status(500).send(err) }
//   })
// }

module.exports = {
  authenticate: authenticate
}

function authenticate (strategy, options) {
  if (!strategy || typeof strategy.authenticate !== 'function') {
    throw new Error("The parameter 'strategy' must be a passport strategy instance.")
  }

  if (typeof options !== 'object') {
    throw new Error("The parameter 'options' must be an object")
  }

  // body, query, headers, connection, url, host
  mandatory(options.req, 'options.req')
  mandatory(options.error, 'options.error')
  mandatory(options.fail, 'options.fail')
  mandatory(options.success, 'options.success')
  mandatory(options.pass, 'options.pass')
  mandatory(options.redirect, 'options.redirect')

  var answered = false
  function done (type, params) {
    if (answered) return
    answered = true
    options[type].apply(null, params)
  }

  var str = Object.create(strategy)

  str.success = function (user, info) {
    done('success', [user, info])
  }

  str.fail = function (challenge, status) {
    if (typeof challenge === 'number') {
      status = challenge
      challenge = undefined
    }

    done('fail', [challenge, status])
  }

  str.redirect = function (url, status) {
    if (typeof url !== 'string') throw new Error('The redirect url must be a string')
    done('redirect', [url, status])
  }

  str.pass = function () {
    done('pass', [])
  }

  str.error = function (err) {
    done('error', [err])
  }

  str.authenticate(options.req, options.options || {})
}

function mandatory (val, key) {
  if (!val) {
    throw new Error("The parameter '" + key + "' is mandatory")
  }
}

