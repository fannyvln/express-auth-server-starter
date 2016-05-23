const passport = require('passport');
const passportService = require('../services/passport');
const authController = require('../controllers/auth');
const postsController = require('../controllers/posts');
const utils = require('../utils');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  // Sign in using email and password.
  app.post('/signin', requireSignin, authController.signin);
  // Creat a new local account.
  app.post('/signup', authController.signup);
  // Check if token is valid.
  app.get('/validate-token', requireAuth, (req, res) => {
    res.send({ user: utils.getCleanUser(req.user) });
  });
  // Check if an email exists or if it is available.
  app.post('/validate-email', authController.validateEmail);

  // Create a new verification token, then send a new verification email with that token.
  app.get('/send-email/verification', requireAuth, authController.resendVerificationEmail);
  // Process the verify email request.
  app.get('/verify-email/:token', authController.verifyEmail);

  // Create a random token, then the send an email with a reset link.
  app.post('/send-email/forgot', authController.forgot);
  // Process the reset password request.
  app.post('/reset/:token', authController.reset);

  // Update name associated with account.
  app.post('/account/name', requireAuth, authController.updateName);
  // Update email associated with account.
  app.post('/account/email', requireAuth, authController.updateEmail);
  // Change account password.
  app.post('/account/password', requireAuth, authController.changePassword);
  // Delete account.
  app.post('/account/delete', requireAuth, authController.deleteAccount);

  // Fetch all posts.
  app.get('/posts', postsController.fetchPosts);
  // Fetch post by id.
  app.get('/posts/:postId', postsController.fetchPost);
  // Edit post by id.
  app.post('/posts/edit/:postId', requireAuth, postsController.editPost);
  // Delete post by id.
  app.delete('/posts/:postId', requireAuth, postsController.deletePost);
  // Create a new post.
  app.post('/posts', requireAuth, postsController.createPost);
};
