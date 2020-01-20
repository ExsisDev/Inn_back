"use strict";

var express = require('express');

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var router = express.Router();

var _require3 = require('../controllers/Proposal.controller'),
    createProposal = _require3.createProposal; //Rutas para proposals/


router.post('/', [auth], createProposal);
module.exports = router;