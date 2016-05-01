const jwt = require('jwt-simple');
const User = require('../models/user');
const dotenv = require('dotenv').config();
const utils = require('../utils');
const emailUtils = require('../utils/email');

exports.signin = (req, res, next) => {
  res.send({
    token: utils.generateToken(req.user),
    user: utils.getCleanUser(req.user),
  });
};

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

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

    if (!user) {
      return res.status(404).json({
        message: 'Email token is not valid or has expired',
      });
    }

    user.isEmailVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpires = undefined;
    user.save((err) => {
      res.json({
        user: utils.getCleanUser(user),
      });
    });
  });
};

exports.resendVerificationEmail = (req, res, next) => {
  User.findById({
    '_id': req.user._id,
  }, (err, user) => {
    if (err) throw err;

    emailUtils.sendVerificationEmail(user, req.headers.host, (err) => {
      if (err) {
        res.status(404).json(err);
      } else {
        res.send({ message: 'Email was resent' });
      }
    });

    res.json({
      message: 'success!',
    });
  });
};
