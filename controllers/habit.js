const mongoose = require('mongoose');

const User = require('../models/user.js');
const Habit = require('../models/habit.js');


exports.fetchHabits = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: 'Not Authorized' });
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: 'LOG[fetchHabits]: Failed to fetch habits - INVALID USER ID' });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'No user found' });
  }

  const habits = await Habit.find({ userId: user._id }).select().sort('hour minute');

  return res.status(200).json({ habits, message: 'Habits fetched successfully' });
};

exports.createHabit = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: 'Not Authorized' });
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: 'LOG[createHabit]: Failed to create habit - INVALID USER ID' });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'No user found' });
  }

  const { name, description, hour, minute } = req.body;

  if (!name || !description || !hour || !minute) {
    return res.status(400).json({ message: 'LOG[createHabit]: Failed to create habit - INVALID HABIT DATA' });
  }
  
  const habit = new Habit({ userId: user._id, name, description, hour, minute });
  
  const savedHabit = await habit.save();

  user.habits.push({ habitId: savedHabit._id });

  await user.save();

  return res.status(201).json({ message: 'Habit created successfully', habit: savedHabit });
};

exports.deleteHabit = async (req, res, next) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: 'Not Authorized' });
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: 'LOG[deleteHabit]: Failed to create habit - INVALID USER ID' });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'No user found' });
  }

  const { habitId } = req.params;

  if (!habitId) {
    return res.status(400).json({ message: 'LOG[deleteHabit]: Failed to delete habit - INVALID HABIT ID' });
  }

  const deletedHabit = await Habit.findByIdAndDelete(habitId);;
  
  if (!deletedHabit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  await User.updateOne({ _id: userId }, { $pull: { habits: { habitId: habitId } } });

  return res.status(200).json({ message: 'Habit and its references deleted successfully', habit: deletedHabit });
};