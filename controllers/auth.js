const jwt = require('jwt-simple');
const User = require('../models/user');
const dotenv = require('dotenv').config();
const utils = require('../utils');
const emailUtils = require('../utils/email');

/**
 * POST /api/user/signin
 * Sign in using email and passsword.
 */
exports.signin = (req, res, next) => {
  res.send({
    token: utils.generateToken(req.user),
    user: utils.getCleanUser(req.user),
  });
};

/**
 * POST /api/user/signin
 * Create a new local account.
 */
exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password.trim();
  const name = req.body.name.trim();

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) return next(err);

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const user = new User({
      email,
      password,
      name,
      isEmailVerified: false,
    });

    user.save((err) => {
      if (err) return next(err);
      emailUtils.sendVerificationEmail(user, req.headers.host);

      res.json({
        token: utils.generateToken(user),
        user: utils.getCleanUser(user),
      });
    });
  });
};

/**
 * POST /api/user/validate-email
 * Check if an email exists or if it is available.
 */
exports.validateEmail = (req, res, next) => {
  const email = req.body.email || req.body.newEmail;
  console.log(email);
  User.findOne({ email }, (err, user) => {
    if (err) next(err);
    if (user) {
      return res.status(403).send({ email: 'email is not unique' });
    }
    res.json({});
  });
};

/**
 * GET /api/email/verification
 * Create a new verification token, then send a new verification email with that token.
 */
exports.resendVerificationEmail = (req, res, next) => {
  User.findById({
    '_id': req.user._id,
  }, (err, user) => {
    if (err) next(err);
    if (!user) {
      return res.status(404).json({
        message: 'No account with that id exists',
      });
    }

    emailUtils.sendVerificationEmail(user, req.headers.host, (err) => {
      if (err) {
        res.status(404).json(err);
      } else {
        res.send({ message: 'Email was resent' });
      }
    });

    res.json({
      message: 'success',
    });
  });
};

/**
 * GET /api/verify-email/:token
 * Process the verify email request.
 */
exports.verifyEmail = (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({
      message: 'Must pass token',
    });
  }

  User.findOne({
    verifyEmailToken: req.params.token,
    verifyEmailTokenExpires: {
      $gt: Date.now(),
    },
  }, (err, user) => {
    if (err) next(err);
    if (!user) {
      return res.status(404).json({
        message: 'Email token is not valid or has expired',
      });
    }

    user.isEmailVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpires = undefined;
    user.save((err) => {
      if (err) next(err);
      res.json({
        user: utils.getCleanUser(user),
      });
    });
  });
};

/**
 * POST /api/email/forgot
 * Create a random token, then the send an email with a reset link.
 */
exports.forgot = (req, res, next) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) next(err);
    if (!user) {
      return res.status(404).json({
        error: 'Account doesn\'t exist',
      });
    }

    emailUtils.sendForgotPasswordEmail(user, req.headers.host, (err) => {
      if (err) {
        res.status(404).json(err);
      } else {
        res.send({ message: 'Email was sent' });
      }
    });

    res.json({
      message: 'success',
    });
  });
};

/**
 * POST /api/reset/:token
 * Process the reset password request.
 */
exports.reset = (req, res, next) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordTokenExpires: { $gt: Date.now() },
  }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(404).json({
        message: 'Error',
      });
    }

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    emailUtils.sendPasswordHasBeenResetEmail(user, req.headers.host);

    user.save(err => {
      res.json({
        token: utils.generateToken(user),
        user: utils.getCleanUser(user),
      });
    });
  });
};

/**
 * POST /api/account/name
 * Update name associated with account.
 */
exports.updateName = (req, res, next) => {
  User.findById({ '_id': req.user._id }, (err, user) => {
    if (err) next(err);
    if (!user) {
      return res.status(404).json({
        error: 'No account with that id exists',
      });
    }

    if (req.body.newName === user.name) {
      return res.status(400).json({
        error: 'Identical name',
      });
    }

    user.name = req.body.newName;
    user.save((err) => {
      if (err) next(err);
      res.json({
        token: utils.generateToken(user),
        user: utils.getCleanUser(user),
      });
    });
  });
};

/**
 * POST /api/account/email
 * Update email associated with account.
 */
exports.updateEmail = (req, res, next) => {
  User.findById({ '_id': req.user._id }, (err, user) => {
    if (err) {
      if (err.code === 11000) {
        return res.status(404).json({
          error: 'Email address already associated with an account',
        });
      } else {
        throw err;
      }
    }
    if (!user) {
      return res.status(404).json({
        message: 'No account with that id exists',
      });
    }

    user.email = req.body.newEmail;
    user.isEmailVerified = false;

    user.save((err) => {
      if (err) return next(err);
      emailUtils.sendVerificationEmail(user, req.headers.host);

      res.json({
        token: utils.generateToken(user),
        user: utils.getCleanUser(user),
      });
    });
  });
};

/**
 * POST /api/account/password
 * Change account password.
 */
exports.changePassword = (req, res, next) => {
  User.findById({ '_id': req.user._id }, (err, user) => {
    if (err) next(err);
    if (!user) {
      return res.status(404).json({
        message: 'No account with that id exists',
      });
    }

    user.password = req.body.newPassword;
    user.save(err => {
      if (err) next(err);
      res.json({
        token: utils.generateToken(user),
        user: utils.getCleanUser(user),
      });
    });
  });
};

/**
 * POST /api/account/delete
 * Delete account.
 */
exports.deleteAccount = (req, res, next) => {
  User.remove({ '_id': req.user._id }, (err, user) => {
    if (err) return next(err);
    res.json({ message: 'account deleted' });
  });
};
