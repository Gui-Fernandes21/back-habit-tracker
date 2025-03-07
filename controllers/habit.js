const mongoose = require('mongoose');

const User = require('../models/user.js');
const Habit = require('../models/habit.js');


exports.fetchHabits = async (req, res) => {
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

  const { filter } = req.query;

  const filterCriteria = filter && filter !== "ALL" ? { userId: user._id, status: filter } : { userId: user._id };

  const habits = await Habit.find(filterCriteria).select();

  const statusOrder = {
    TODO: 0,
    SKIP: 1,
    DONE: 2
  };
  
  habits.sort((a, b) => {
    // 1. Compare by status first
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // 2. If status is the same, compare by hour
    if (a.hour !== b.hour) {
      return a.hour - b.hour;
    }
    // 3. If hour is the same, compare by minute
    return a.minute - b.minute;
  });

  return res.status(200).json({ habits, message: 'Habits fetched successfully' });
};

exports.createHabit = async (req, res) => {
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

  console.log(req.body);
  const { name, description, hour, minute, startDate } = req.body;

  if (!name || !description || !hour || !minute || !startDate) {
    return res.status(400).json({ message: 'LOG[createHabit]: Failed to create habit - INVALID HABIT DATA' });
  }
  
  const habit = new Habit({ userId: user._id, name, description, hour, minute, status: 'TODO', startDate });
  
  const savedHabit = await habit.save();

  user.habits.push({ habitId: savedHabit._id });

  await user.save();

  return res.status(201).json({ message: 'Habit created successfully', habit: savedHabit });
};

exports.deleteHabit = async (req, res) => {
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

exports.updateHabit = async (req, res) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: 'Not Authorized' });
  }

  const { habitId } = req.params;

  if (!habitId) {
    return res.status(400).json({ message: 'LOG[updateHabit]: Failed to update habit - INVALID HABIT ID' });
  }

  const habitData = req.body;

  const updatedHabit = await Habit.findByIdAndUpdate(habitId, habitData, { returnDocument: 'after' });

  if (!updatedHabit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  return res.status(200).json({ message: 'Habit updated successfully', habit: updatedHabit });
};

exports.confirmHabit = async (req, res) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: 'Not Authorized' });
  }

  const { habitId } = req.params;

  if (!habitId) {
    return res.status(400).json({ message: 'LOG[confirmHabit]: Failed to confirm habit - INVALID HABIT ID' });
  }

  const updatedHabit = await Habit.findByIdAndUpdate(habitId, { status: 'DONE' }, { returnDocument: 'after' });

  if (!updatedHabit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  return res.status(200).json({ message: 'Habit confirmed successfully', habit: updatedHabit });
};

exports.resetHabit = async (req, res) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: 'Not Authorized' });
  }

  const { habitId } = req.params;

  if (!habitId) {
    return res.status(400).json({ message: 'LOG[resetHabit]: Failed to reset habit - INVALID HABIT ID' });
  }

  const updatedHabit = await Habit.findByIdAndUpdate(habitId, { status: 'TODO' }, { returnDocument: 'after' });

  if (!updatedHabit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  return res.status(200).json({ message: 'Habit reset successfully', habit: updatedHabit });
};

exports.skipHabit = async (req, res) => {
  if (!req.isAuth) {
    return res.status(403).json({ message: 'Not Authorized' });
  }

  const { habitId } = req.params;

  if (!habitId) {
    return res.status(400).json({ message: 'LOG[skipHabit]: Failed to skip habit - INVALID HABIT ID' });
  }

  const updatedHabit = await Habit.findByIdAndUpdate(habitId, { status: 'SKIP' }, { returnDocument: 'after' });

  if (!updatedHabit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  return res.status(200).json({ message: 'Habit skipped successfully', habit: updatedHabit });
};