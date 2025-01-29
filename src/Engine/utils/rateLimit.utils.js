const { RATE_LIMIT } = require('../config/app.config');

const userMessageCount = {};

function checkRateLimit(userId) {
  const now = Date.now();
  
  if (!userMessageCount[userId]) {
    userMessageCount[userId] = { count: 0, lastReset: now };
  }

  if (now - userMessageCount[userId].lastReset > 10000) {
    userMessageCount[userId] = { count: 0, lastReset: now };
  }

  return userMessageCount[userId].count < RATE_LIMIT;
}

function updateCount(userId) {
  userMessageCount[userId].count++;
}

function clearUser(userId) {
  delete userMessageCount[userId];
}

module.exports = { checkRateLimit, updateCount, clearUser };