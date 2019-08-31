const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usersModel = require('../users/users-model');
const secrets = require('../config/secrets');

router.post('/register', validateUser, async (req, res) => {
  try {
    let credentials = req.body;
    let hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    let new_user = await usersModel.insert(credentials);
    res.status(201).json(new_user);
  } catch (err) {
    res.status(500).json({ error: 'There was an error saving the user to the database.' });
  }
});

router.post('/login', validateUser, async (req, res) => {
  try {
    let user = await usersModel.getByUsername(req.body.username);
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      let token = generateToken(user);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'There was an error logging in.' });
  }
});

function validateUser(req, res, next) {
  if (req.body) {
    if (req.body.username) {
      if (req.body.password) {
        next();
      } else {
        res.status(400).json({ message: 'Missing required password field.' });
      }
    } else {
      res.status(400).json({ message: 'Missing required username field.' });
    }
  } else {
    res.status(400).json({ message: 'Missing user data.' });
  }
}

function generateToken(user) {
  let payload = {
    subject: user.id,
    username: user.username
  }
  let options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
