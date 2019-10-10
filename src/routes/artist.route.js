const express = require('express');
const router = express.Router();
const { createArtist, getAllArtists, getById, updateArtist, deleteArtist } = require('../controllers/artist.controller');


router.post('/', createArtist);
router.get('/', getAllArtists);
router.get('/:id', getById);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);


module.exports = router;