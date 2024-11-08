const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
  });
  
  const User = mongoose.model('User', userSchema);
  module.exports = User;
  