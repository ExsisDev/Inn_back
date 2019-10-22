const express = require('express');
const router = express.Router();

const {
   createUser,
   authenticateUser
} = require('../controllers/user.controller');

// (/api/users)

router.post('/', createUser);
router.post('/auth', authenticateUser);

module.exports = router;