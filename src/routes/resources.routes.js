const express = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

const { getResourcesByAllyId } = require('../controllers/Resources.controller');

// Rutas para /allies/resources

router.get('/:allyId', getResourcesByAllyId);

module.exports = router;