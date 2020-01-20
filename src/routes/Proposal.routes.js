const express = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

const {
   createProposal
} = require ('../controllers/Proposal.controller');

//Rutas para proposals/

router.post('/', [auth], createProposal);

module.exports = router;