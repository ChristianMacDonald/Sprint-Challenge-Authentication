/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

module.exports = (req, res, next) => {
  if (req.headers.token) {
    try {
      let decoded = jwt.verify(req.headers.token, secrets.jwtSecret);
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token.' });
    }
  } else {
    res.status(401).json({ message: 'Missing token.' });;
  }
};
