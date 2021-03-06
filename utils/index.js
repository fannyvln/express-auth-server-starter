const jwt = require('jwt-simple');

function generateToken(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
}

function getCleanUser(user) {
  const cleanUser = {};
  const keys = [
    '_id',
    'email',
    'name',
    'isEmailVerified',
  ];

  keys.forEach(key => {
    cleanUser[key] = user[key];
  });
  return cleanUser;
}

module.exports = {
  generateToken,
  getCleanUser,
};
