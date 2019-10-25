"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../controllers/artist.controller'),
    createArtist = _require2.createArtist,
    getAllArtists = _require2.getAllArtists,
    getByArtistId = _require2.getByArtistId,
    getArtistsByIdCategory = _require2.getArtistsByIdCategory,
    updateArtist = _require2.updateArtist,
    deleteArtist = _require2.deleteArtist; // (/api/artists)


router.post('/', createArtist);
router.get('/', auth, getAllArtists);
router.get('/:id', getByArtistId);
router.get('/artistsByCategory/:id_category', getArtistsByIdCategory);
router.put('/:id', updateArtist);
router["delete"]('/:id', deleteArtist);
module.exports = router;