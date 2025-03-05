const express = require('express');

const authControllers = require('../controllers/auth.js');
const userControllers = require('../controllers/user.js');
const habitControllers = require('../controllers/habit.js');

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});


// =======================AUTH================================

router.post('/signup', authControllers.signup);

router.post('/login', authControllers.login);


// =======================HABITS================================

router.get('/fetch-habits', habitControllers.fetchHabits);

router.post('/add-habit', habitControllers.createHabit);

// TODO - ADD A CONFIRM HABIT ROUTE
router.post('/confirm-habit/:habitId', habitControllers.confirmHabit);

// TODO - ADD A SKIP HABIT ROUTE
router.post('/skip-habit/:habitId', habitControllers.skipHabit);

router.delete('/delete-habit/:habitId', habitControllers.deleteHabit);

router.patch('/update-habit/:habitId', habitControllers.updateHabit);


// =======================USER================================

router.get('/user-profile', userControllers.getUserProfile);

router.post('/upload-profile-picture', userControllers.uploadProfilePicture);

router.delete('/delete-profile-picture', userControllers.deleteProfilePicture);

router.patch('/update-user-details', userControllers.updateUserDetails);

router.patch('/update-password', userControllers.updatePassword);

module.exports = router;