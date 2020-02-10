const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const { getNotesByChallenge } = require('../controllers/Notes.controller');


//  Rutas para /api/notes

router.get('/:id_challenge', [auth], getNotesByChallenge);


module.exports = router;