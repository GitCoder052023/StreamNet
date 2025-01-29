const crypto = require('crypto');

function signMessage(message) {
  return crypto
    .createHmac('sha256', process.env.SECRET_KEY)
    .update(message)
    .digest('hex');
}

module.exports = { signMessage };