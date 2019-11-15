const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');


const {
   createAlly
} = require('../controllers/Ally.controller');


/*** Rutas para /api/allies*/

/** 
 * Crear un aliado con body (Solo para admin)
 * {fk_id_role, fk_user_state, user_email, user_password, user_last_login, ally_name, ally_nit, 
 * ally_web_page, ally_phone, ally_month_ideation_hours, ally_month_experimentation_hours}
 * retornando el token del aliado creado en el header 
 */
router.post('/', [auth, isAdmin], createAlly);


module.exports = router;