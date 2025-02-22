const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const idSubSchema = new Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { _id: false }
);

const habitSubSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  hour: { type: Number, required: true },
  minute: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const habitSchema = new Schema({
  user: idSubSchema,
  habitList: [habitSubSchema],
});

module.exports = mongoose.model('Habit', habitSchema);