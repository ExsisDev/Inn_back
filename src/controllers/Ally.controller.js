const { validateBodyAllyCreation, validateBodyAllyUpdate, validateAllyAuth } = require('../schemas/Ally.validations');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Ally = require('../models/Ally');
const UserController = require('./User.controller');


/**
 * Verificar la validéz de los parametros del body
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {CallableFunction} callBackValidation 
 */
function getValidParams(req, res, callBackValidation) {
   const { error } = callBackValidation(req.body);
   return (error) ? res.status(400).send(error.details[0].message) : req.body;
}


/**
 * Crear aliado:
 * 1. verificando el body, 
 * 2. comprobando la no existencia del usuario,
 * 3. creando el aliado 
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */
export async function createAlly(req, res) {
   const bodyAttributes = getValidParams(req, res, validateBodyAllyCreation);

   const allyAttributes = _.pick(bodyAttributes, ['ally_name', 'ally_nit', 'ally_web_page', 'ally_phone', 'ally_month_ideation_hours', 'ally_month_experimentation_hours']);
   const userAttributes = _.pick(bodyAttributes, ['fk_id_role', 'fk_user_state', 'user_email', 'user_password', 'user_last_login']);

   UserController.createUser(userAttributes).then((result) => {
      console.log("Resultado de creación de usuario: ", result);
      // const token = created.generateAuthToken();
      // return res.header('x-auth-token', token).status(200).send(_.pick(created, ['id_user', 'name', 'email', 'is_admin']));
   }).catch((error) => {
      console.log(error);
   })
}


/**
 * Validar email y constraseña de un aliado:
 * 1. Validando el body
 * 2. Verificando el correo y la contraseña
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function authenticateAlly(req, res) {
   const userAttributes = getValidParams(req, res, validateAllyAuth);

   Ally.findOne({
      where: { ally_email: userAttributes.ally_email }
   }).then((result) => {
      if (!result) return res.status(400).send("Invalid email or password");

      bcrypt.compare(userAttributes.ally_password, result.ally_password, function (compareError, compareResponse) {
         if (compareError) return res.status(500).send("Error verifying password: ", compareError);
         if (!compareResponse) return res.status(400).send("Invalid email or password");

         const token = result.generateAuthToken();
         return res.header('x-auth-token', token).send("User authenticated");

      });
   }).catch((error) => {
      return res.status(500).send(error);

   });
}
