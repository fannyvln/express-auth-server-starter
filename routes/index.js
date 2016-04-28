const Authentication = require('../controllers/authentication');
const passport = require('passport');
const passportService = require('../services/passport');
const utils = require('../utils');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function (app) {
  app.get('/secret', requireAuth, (req, res) => {
    res.send({ message: 'The secret code is 93b2zk' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
  app.get('/validatetoken', requireAuth, (req, res) => {
    res.send({ user: utils.getCleanUser(req.user) });
  });
};
