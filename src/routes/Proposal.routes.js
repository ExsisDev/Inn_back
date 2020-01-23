const express = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

const {
   createProposal,
   searchProposalByState
} = require ('../controllers/Proposal.controller');

//Rutas para proposals/

router.post('/', [auth], createProposal);

/**
 * Obtener los retos de acuerdo al estado de la propuesta
 * :page -> pagina a buscar
 * :status -> estado de la propuesta
 * 
 */
router.get('/:status', [auth], searchProposalByState);

module.exports = router;