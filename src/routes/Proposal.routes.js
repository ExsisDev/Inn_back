const express = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

const {
   createProposal,
   searchProposalByState,
   updateProposalState,
   searchProposalByChallengeAndState,
   getProposalsAssignedByChallenge
} = require ('../controllers/Proposal.controller');

//Rutas para proposals/

router.post('/', [auth], createProposal);

/**
 * Obtener las propuestas enviadas para el reto
 * :id_challenge -> id del reto actual
 * :status -> estado de la propuesta
 * :page -> pagina a buscar * 
 */
router.get('/:id_challenge/:status/:page', [auth], searchProposalByChallengeAndState);

/**
 * Obtener propuesta asignada al reto
 */
router.get('/proposalAssigned/:idChallenge', [auth, isAdmin], getProposalsAssignedByChallenge);

/**
 * Obtener los retos de acuerdo al estado de la propuesta
 * :status -> estado de la propuesta
 * :page -> pagina a buscar
 * 
 */
router.get('/:status/:page', [auth], searchProposalByState);


/**
 * Actualizar la propuesta pasando en el body los atributos
 */
router.put('/:idChallenge/:idAlly', [auth], updateProposalState);



module.exports = router;