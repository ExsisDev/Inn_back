"use strict";

var express = require('express');

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var router = express.Router();

var _require3 = require('../controllers/Proposal.controller'),
    createProposal = _require3.createProposal,
    searchProposalByState = _require3.searchProposalByState,
    searchProposalByChallengeAndState = _require3.searchProposalByChallengeAndState,
    getProposalsAssignedByChallenge = _require3.getProposalsAssignedByChallenge,
    updateProposalByChallengeAndAlly = _require3.updateProposalByChallengeAndAlly,
    updateProposal = _require3.updateProposal; //Rutas para proposals/

/**Crear una propuesta */


router.post('/', [auth], createProposal);
/**
 * Obtener las propuestas enviadas para el reto
 * :id_challenge -> id del reto actual
 * :status -> estado de la propuesta
 * :page -> pagina a buscar * 
 */

router.get('/:id_challenge/:status/:page', [auth], searchProposalByChallengeAndState);
/**
 * Obtener propuestas asignada al reto
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

router.put('/:idChallenge/:idAlly', [auth], updateProposal);
/**
 * Actualizar estado de una propuesta y de un reto a Asignada
 * :id_challenge -> id del reto actual
 * :id_ally -> id del aliado actual
 */

router.put('/assign/:id_challenge/:id_ally', [auth], updateProposalByChallengeAndAlly);
module.exports = router;