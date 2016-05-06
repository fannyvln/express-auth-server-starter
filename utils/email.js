const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const User = require('../models/user');

function sendVerificationEmail(user, host, finalCB) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      user.verifyEmailToken = token;
      // Make token expire in 24 hours
      user.verifyEmailTokenExpires = Date.now() + 3600000 * 24;

      user.save(function (err) {
        done(err, user);
      });
    },
    function (user, done) {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
      const mailOptions = {
        from: 'support@demo.com',
        to: user.email,
        subject: 'Verify Email',
        text: `Hey placeholdername,
          Please click the link below to verify your account:
          http://${host}/verifyemail/${user.verifyEmailToken}\n
          Thanks,
          Demo Team`,
      };
      transporter.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    },
  ], (err) => {
    if (err) {
      console.log(`Could not send welcome email to: ${user.email}`);
      console.error(err);
      if (finalCB) {
        finalCB({
          message: `Could not send welcome email to: ${user.email}`,
        });
      } else {
        if (finalCB) {
          finalCB();
        }
      }
    }
  });
}

function sendForgotPasswordEmail(user, host, finalCB) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      user.resetPasswordToken = token;
      // Token expires in 1 hour
      user.resetPasswordTokenExpires = Date.now() + 3600000;

      user.save(function (err) {
        done(err, user);
      });
    },
    function (user, done) {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
      const mailOptions = {
        from: 'support@demo.com',
        to: user.email,
        subject: 'Password reset request',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
          Please click on the following link, or paste this into your browser to complete the process:
          http://${host}/reset/${user.resetPasswordToken}
          If you did not request this, please ignore this email and your password will remain unchanged.`,
      };
      transporter.sendMail(mailOptions, (err) => {
        done(err, 'done');
      });
    },
  ], (err) => {
    if (err) {
      console.log(`Could not send welcome email to: ${user.email}`);
      console.error(err);
      if (finalCB) {
        finalCB({
          message: `Could not send welcome email to: ${user.email}`,
        });
      } else {
        if (finalCB) {
          finalCB();
        }
      }
    }
  });
}

function sendPasswordHasBeenResetEmail(user, host) {
  const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: process.env.SENDGRID_USER,
      pass: process.env.SENDGRID_PASSWORD,
    },
  });
  const mailOptions = {
    to: user.email,
    from: 'support@demo.com',
    subject: 'Your password has been changed',
    text: `Hello,\n\n'
    This is a confirmation that the password for your account${user.email}has just been changed.\n`,
  };
  transporter.sendMail(mailOptions);
}

module.exports = {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendPasswordHasBeenResetEmail,
};
