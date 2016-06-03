# Passport strategy execution

```javascript
var Strategy = require('./some-strategy')
var strategy = new Strategy({clientId: 'foo'}, function (user, done) {
  done(null, user)
})

var passport = require('passport-light')
function exampleController (req, res, next) {
  passport.authenticate(strategy, {
    req: req,
    redirect: function (url, status) { res.redirect(url, status) },
    success: function (user, info) { res.send(user) },
    pass: function () { res.sendStatus(401) },
    fail: function (challenge, status) { res.status(status).send(challenge) },
    error: function (err) { res.status(500).send(err) }
  })
}
```
