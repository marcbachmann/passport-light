var assert = require('assert')
var passport = require('./')

function Strategy () {}
Strategy.prototype.authenticate = function (req) {
  this.error(new Error('something is wrong'))
}

passport.authenticate(new Strategy(), {
  req: {},
  success: assert.fail,
  fail: assert.fail,
  pass: assert.fail,
  redirect: assert.fail,
  error: function (err) {
    assert.equal(err.message, 'something is wrong')
  }
})

function Strategy2 () {}
Strategy2.prototype.authenticate = function (req) {
  this.fail('foobar', 401)
}

passport.authenticate(new Strategy2(), {
  req: {},
  success: assert.fail,
  pass: assert.fail,
  redirect: assert.fail,
  error: assert.fail,
  fail: function (challenge, status) {
    assert.equal(challenge, 'foobar')
    assert.equal(status, 401)
  }
})

function Strategy3 () {}
var user = {id: 1, name: 'Foo'}
var info = {foo: 'bar'}
Strategy3.prototype.authenticate = function (req) {
  this.success(user, info)
}

passport.authenticate(new Strategy3(), {
  req: {},
  pass: assert.fail,
  redirect: assert.fail,
  error: assert.fail,
  fail: assert.fail,
  success: function (loggedInUser, localInfo) {
    assert.equal(user, loggedInUser)
    assert.equal(info, localInfo)
  }
})

function Strategy4 () {}
var options = {foo: 'bar'}
Strategy4.prototype.authenticate = function (req, localOptions) {
  assert.equal(options, localOptions, 'Passes through the options')
}

passport.authenticate(new Strategy4(), {
  req: {},
  options: options,
  success: assert.fail,
  redirect: assert.fail,
  error: assert.fail,
  fail: assert.fail,
  pass: assert.fail
})

function RedirectStrategy () {}
RedirectStrategy.prototype.authenticate = function (req, localOptions) {
  this.redirect('http://example.com', 302)
}

passport.authenticate(new RedirectStrategy(), {
  req: {},
  options: options,
  success: assert.fail,
  error: assert.fail,
  fail: assert.fail,
  pass: assert.fail,
  redirect: function (url, status) {
    assert.equal(url, 'http://example.com')
    assert.equal(status, 302)
  }
})
