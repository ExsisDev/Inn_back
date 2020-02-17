"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var _require3 = require('../controllers/Notes.controller'),
    getNotesByChallenge = _require3.getNotesByChallenge,
    createNote = _require3.createNote; //  Rutas para /api/notes


router.get('/:id_challenge', [auth], getNotesByChallenge); //Crear una nota con body {fk_id_challenge, note_header, note_content}

router.post('/', [auth], createNote);
module.exports = router;