"use strict";

var express = require('express');

var _require = require('../middleware/auth'),
    auth = _require.auth;

var _require2 = require('../middleware/admin'),
    isAdmin = _require2.isAdmin;

var router = express.Router();

var _require3 = require('../controllers/Resources.controller'),
    getResourcesByAllyId = _require3.getResourcesByAllyId,
    deleteAllyResources = _require3.deleteAllyResources,
    createAllyResource = _require3.createAllyResource; // Rutas para /allies/resources


router.get('/:allyId', getResourcesByAllyId);
router["delete"]('/ally/:allyId/resource/:resourceId', [auth, isAdmin], deleteAllyResources);
router.post('/:allyId', [auth, isAdmin], createAllyResource);
module.exports = router;