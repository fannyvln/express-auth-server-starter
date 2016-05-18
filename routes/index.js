const passport = require('passport');
const passportService = require('../services/passport');
const authController = require('../controllers/auth');
const postsController = require('../controllers/posts');
const utils = require('../utils');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  // Sign in using email and password.
  app.post('/api/signin', requireSignin, authController.signin);
  // Creat a new local account.
  app.post('/api/signup', authController.signup);
  // Check if token is valid.
  app.get('/api/validate-token', requireAuth, (req, res) => {
    res.send({ user: utils.getCleanUser(req.user) });
  });
  // Check if an email exists or if it is available.
  app.post('/api/validate-email', authController.validateEmail);

  // Create a new verification token, then send a new verification email with that token.
  app.get('/api/send-email/verification', requireAuth, authController.resendVerificationEmail);
  // Process the verify email request.
  app.get('/api/verify-email/:token', authController.verifyEmail);

  // Create a random token, then the send an email with a reset link.
  app.post('/api/send-email/forgot', authController.forgot);
  // Process the reset password request.
  app.post('/api/reset/:token', authController.reset);

  // Update name associated with account.
  app.post('/api/account/name', requireAuth, authController.updateName);
  // Update email associated with account.
  app.post('/api/account/email', requireAuth, authController.updateEmail);
  // Change account password.
  app.post('/api/account/password', requireAuth, authController.changePassword);
  // Delete account.
  app.post('/api/account/delete', requireAuth, authController.deleteAccount);

  // Fetch all posts.
  app.get('/api/posts', postsController.fetchPosts);
  // Fetch post by id.
  app.get('/api/posts/:postId', postsController.fetchPost);
  // Edit post by id.
  app.post('/api/posts/edit/:postId', requireAuth, postsController.editPost);
  // Delete post by id.
  app.delete('/api/posts/:postId', requireAuth, postsController.deletePost);
  // Create a new post.
  app.post('/api/posts', requireAuth, postsController.createPost);
};
