var test = require('tape')
var passport = require('./')

test('error case', function (t) {
  t.plan(1)

  function Strategy () {}
  Strategy.prototype.authenticate = function (req) {
    this.error(new Error('something is wrong'))
  }

  passport.authenticate(new Strategy(), {
    req: {},
    success: t.fail,
    fail: t.fail,
    pass: t.fail,
    redirect: t.fail,
    error: function (err) {
      t.equal(err.message, 'something is wrong')
    }
  })
})

test('fail case', function (t) {
  t.plan(2)

  function Strategy2 () {}
  Strategy2.prototype.authenticate = function (req) {
    this.fail('foobar', 401)
  }

  passport.authenticate(new Strategy2(), {
    req: {},
    success: t.fail,
    pass: t.fail,
    redirect: t.fail,
    error: t.fail,
    fail: function (challenge, status) {
      t.equal(challenge, 'foobar')
      t.equal(status, 401)
    }
  })
})

test('success case', function (t) {
  t.plan(2)

  function Strategy3 () {}
  var user = {id: 1, name: 'Foo'}
  var info = {foo: 'bar'}
  Strategy3.prototype.authenticate = function (req) {
    this.success(user, info)
  }

  passport.authenticate(new Strategy3(), {
    req: {},
    pass: t.fail,
    redirect: t.fail,
    error: t.fail,
    fail: t.fail,
    success: function (loggedInUser, localInfo) {
      t.equal(user, loggedInUser)
      t.equal(info, localInfo)
    }
  })
})

test('options object', function (t) {
  t.plan(1)

  function Strategy4 () {}
  var options = {foo: 'bar'}
  Strategy4.prototype.authenticate = function (req, localOptions) {
    t.equal(options, localOptions, 'Passes through the options')
  }

  passport.authenticate(new Strategy4(), {
    req: {},
    options: options,
    success: t.fail,
    redirect: t.fail,
    error: t.fail,
    fail: t.fail,
    pass: t.fail
  })
})

test('redirect', function (t) {
  t.plan(2)

  function RedirectStrategy () {}
  RedirectStrategy.prototype.authenticate = function (req, localOptions) {
    this.redirect('http://example.com', 302)
  }

  passport.authenticate(new RedirectStrategy(), {
    req: {},
    success: t.fail,
    error: t.fail,
    fail: t.fail,
    pass: t.fail,
    redirect: function (url, status) {
      t.equal(url, 'http://example.com')
      t.equal(status, 302)
    }
  })
})
