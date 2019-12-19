const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');


const {
   createAlly,
   updateAlly,
   getAllyById,
   getAllies
} = require('../controllers/Ally.controller');


/*** Rutas para /api/allies*/

/** 
 * Crear un aliado con body (Solo para admin)
 * {fk_id_role, fk_user_state, user_email, user_password, ally_name, ally_nit, 
 * ally_web_page, ally_phone, ally_month_ideation_hours, ally_month_experimentation_hours,
 * ally_categories, ally_resources}
 * retornando el token del aliado creado en el header 
 */
router.post('/', [auth, isAdmin], createAlly);

/**
 * Actualizar horas y/o categorias del aliado (solo para admin).
 * { ally_categories, ally_month_experimentation_hours, 
 * ally_month_experimentation_hours}
 * retorna  un bojeto con los siguientes atributos: 
 * {
 *   id_ally, ally_name, ally_nit, ally_web_page,
 *   ally_phone, ally_month_ideation_hours,
 *   ally_month_experimentation_hours, 
 *   ally_categories [ { id_category, category_name } ]
 * }
 */
router.put('/:idAlly', [auth, isAdmin], updateAlly);

router.get('/:idAlly', [auth, isAdmin], getAllyById);

/**
 * Obtener retos por página
 */
router.get('/page/:page', [auth], getAllies);

module.exports = router;