const express = require('express');
const router = express.Router();
const { createArtist } = require('../controllers/artist.controller');


router.post('/', createArtist);

module.exports = router;