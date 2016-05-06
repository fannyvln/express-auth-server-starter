const passport = require('passport');
const passportService = require('../services/passport');
const authController = require('../controllers/auth');
const utils = require('../utils');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  app.post('/api/signin', requireSignin, authController.signin);
  app.post('/api/signup', authController.signup);
  app.get('/api/validatetoken', requireAuth, (req, res) => {
    res.send({ user: utils.getCleanUser(req.user) });
  });

  app.get('/api/verifyemail/:token', authController.verifyEmail);
  app.get('/api/resendverificationemail', requireAuth, authController.resendVerificationEmail);

  app.post('/api/forgot', authController.forgotPassword);
  app.post('/api/reset/:token', authController.resetPassword);
  app.post('/api/changepassword', requireAuth, authController.changePassword);
};
