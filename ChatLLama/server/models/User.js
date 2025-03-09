const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: String,
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' }
});

module.exports = mongoose.model('Users', userSchema);
