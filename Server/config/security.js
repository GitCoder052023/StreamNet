require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
  TOKEN_EXPIRY: process.env.TOKEN_EXPIRY
};