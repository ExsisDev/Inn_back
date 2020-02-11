const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const { getNotesByChallenge, createNote } = require('../controllers/Notes.controller');


//  Rutas para /api/notes

router.get('/:id_challenge', [auth], getNotesByChallenge);

//Crear una nota con body {fk_id_challenge, note_header, note_content}
router.post('/', [auth], createNote);


module.exports = router;