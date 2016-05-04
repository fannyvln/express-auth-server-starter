const passport = require('passport');
const passportService = require('../services/passport');
const Authentication = require('../controllers/authentication');
const utils = require('../utils');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  app.post('/api/signin', requireSignin, Authentication.signin);
  app.post('/api/signup', Authentication.signup);
  app.get('/api/validatetoken', requireAuth, (req, res) => {
    res.send({ user: utils.getCleanUser(req.user) });
  });

  app.get('/api/verifyemail/:token', Authentication.verifyEmail);
  app.get('/api/resendverificationemail', requireAuth, Authentication.resendVerificationEmail);

  app.post('/api/forgot', Authentication.forgotPassword);
};
