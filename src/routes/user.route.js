const express = require('express');
const router = express.Router();

const {
   createUser,
   authenticateUser
} = require('../controllers/user.controller');

router.post('/', createUser);
router.post('/auth', authenticateUser);

module.exports = router;