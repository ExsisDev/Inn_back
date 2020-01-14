const express = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

const { getResourcesByAllyId, deleteAllyResources } = require('../controllers/Resources.controller');

// Rutas para /allies/resources

router.get('/:allyId', getResourcesByAllyId);
router.delete('/:allyId', [auth, isAdmin], deleteAllyResources);

module.exports = router;