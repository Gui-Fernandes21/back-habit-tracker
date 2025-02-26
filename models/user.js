const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitSubSchema = new Schema(
  {
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  },
  { _id: false }
);

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  habits: [habitSubSchema],
});

module.exports = mongoose.model('User', userSchema);