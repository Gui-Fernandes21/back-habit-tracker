const mongoose = require('mongoose');

const User = require('../models/user.js');


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

  return res.status(200).json({ habits: user.habits, message: 'Habits fetched successfully' });
};

exports.createHabit() = async (req, res, next) => {
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

  user.habits.push({ name, description, hour, minute });

  await user.save();

  return res.status(201).json({ message: 'Habit created successfully' });
};