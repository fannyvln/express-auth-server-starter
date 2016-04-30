const jwt = require('jwt-simple');

function generateToken(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
}

function getCleanUser(user) {
  const cleanUser = {};
  const safeKeys = [
    '_id',
    'email',
    'isEmailVerified',
  ];

  safeKeys.forEach((key) => {
    cleanUser[key] = user[key];
  });
  return cleanUser;
}

module.exports = {
  generateToken: generateToken,
  getCleanUser: getCleanUser,
};
