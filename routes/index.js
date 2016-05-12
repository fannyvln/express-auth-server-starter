const passport = require('passport');
const passportService = require('../services/passport');
const authController = require('../controllers/auth');
const utils = require('../utils');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  // Sign in using email and password.
  app.post('/api/signin', requireSignin, authController.signin);
  // Creat a new local account.
  app.post('/api/signup', authController.signup);
  // Check for token validity.
  app.get('/api/validate-token', requireAuth, (req, res) => {
    res.send({ user: utils.getCleanUser(req.user) });
  });
  // Check if an email exists or if it can be used.
  app.post('/api/validate-email', authController.validateEmail);

  // Create a new verification token, then send a new verification email with that token.
  app.get('/api/email/verification', requireAuth, authController.resendVerificationEmail);
  // Process the verify email request.
  app.get('/api/verify-email/:token', authController.verifyEmail);

  // Create a random token, then the send an email with a reset link.
  app.post('/api/forgot', authController.forgot);
  // Process the reset password request.
  app.post('/api/reset/:token', authController.reset);

  // Update account email
  app.post('/api/account/email', requireAuth, authController.updateEmail);
  // Change account password
  app.post('/api/account/password', requireAuth, authController.changePassword);
  // Delete account
  app.post('/api/account/delete', requireAuth, authController.deleteAccount);
};
