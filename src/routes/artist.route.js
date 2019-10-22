const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const { 
   createArtist,
   getAllArtists,
   getByArtistId,
   getArtistsByIdCategory,
   updateArtist,
   deleteArtist
 } = require('../controllers/artist.controller');

// (/api/artists)

router.post('/', createArtist);
router.get('/', auth, getAllArtists);
router.get('/:id', getByArtistId);
router.get('/artistsByCategory/:id_category', getArtistsByIdCategory);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);

module.exports = router;