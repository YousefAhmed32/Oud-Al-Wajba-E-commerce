const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    // unique :true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // unique :true,
  },
  role: {
    type: String,
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  phone: {
    type: String,
    default: ''
  },
  lastLogin: {
    type: Date,
    default: null
  }

},
  { timestamps: true }
)


const User = mongoose.model('User', UserSchema)
module.exports = User;