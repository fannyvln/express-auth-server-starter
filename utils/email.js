const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

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

module.exports = {
  sendVerificationEmail: sendVerificationEmail,
};
