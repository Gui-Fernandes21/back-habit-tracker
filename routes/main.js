const express = require('express');

const authControllers = require('../controllers/auth.js');
const habitControllers = require('../controllers/habit.js');

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post('/signup', authControllers.signup);

router.post('/login', authControllers.login);

router.get('/fetch-habits', habitControllers.fetchHabits);

router.post('/add-habit', habitControllers.createHabit);

router.delete('/delete-habit/:habitId', habitControllers.deleteHabit);

router.patch('/update-habit/:habitId', habitControllers.updateHabit);

// router.post('/fetch-user', authControllers.fetchUser);


module.exports = router;