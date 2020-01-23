const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  displayName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    default: "This user has not set an email!"
  },
  firstName: {
    type: String,
    default: "N/A"
  },
  lastName: {
    type: String,
    default: "N/A"
  },
  avatarURL: {
    type: String,
    default: ""
  },
  paypalURL: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: "This user has not set a description!"
  },
  preference: {
    type: String,
    default: "This user has not set a preference!"
  },
  date: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

mongoose.model('users', UserSchema);