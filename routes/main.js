const express = require('express');

const authControllers = require('../controllers/auth.js');
const habitControllers = require('../controllers/habit.js');

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post('/signup', authControllers.signup);

router.post('/login', authControllers.login);

router.post('/fetch-habits', habitControllers.fetchHabits);

// router.post('/fetch-user', authControllers.fetchUser);

// router.post('/fetch-all-users', authControllers.fetchAllUsers);


module.exports = router;