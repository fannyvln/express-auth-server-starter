const jwt = require('jwt-simple');
const User = require('../models/user');
const dotenv = require('dotenv').config();
const utils = require('../utils');

exports.signin = function (req, res, next) {
  res.send({
    token: utils.generateToken(req.user),
    user: utils.getCleanUser(req.user),
  });
};

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const user = new User({
      email,
      password,
    });

    user.save((err) => {
      if (err) {
        return next(err);
      }

      res.json({
        token: utils.generateToken(user),
        user: utils.getCleanUser(user),
      });
    });
  });
};

exports.authWithToken = function (req, res, next) {


};
