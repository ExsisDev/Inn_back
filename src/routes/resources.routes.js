const express = require('express');
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

const { getResourcesByAllyId, deleteAllyResources, createAllyResource } = require('../controllers/Resources.controller');

// Rutas para /allies/resources

router.get('/:allyId', getResourcesByAllyId);
router.delete('/ally/:allyId/resource/:resourceId', [auth, isAdmin], deleteAllyResources);
router.post('/:allyId', [auth, isAdmin], createAllyResource);

module.exports = router;