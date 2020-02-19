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
    updateProposalState = _require3.updateProposalState,
    searchProposalByChallengeAndState = _require3.searchProposalByChallengeAndState; //Rutas para proposals/


router.post('/', [auth], createProposal);
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
/**
 * Obtener las propuestas enviadas para el reto
 * :id_challenge -> id del reto actual
 * :status -> estado de la propuesta
 * :page -> pagina a buscar * 
 */

router.get('/:id_challenge/:status/:page', [auth], searchProposalByChallengeAndState);
module.exports = router;