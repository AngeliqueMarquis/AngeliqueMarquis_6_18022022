/* express import */
const express = require('express');
/* create router */
const router = express.Router();
/* middleware import */
const password = require('../middleware/password');

/* controller import */
const userCtrl = require('../controllers/users');

/* save routes in the router */
router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;