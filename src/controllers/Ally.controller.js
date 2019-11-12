const { validateBodyAllyCreation, validateBodyAllyUpdate, validateAllyAuth } = require('../schemas/Ally.validations');
const _ = require('lodash');
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

   UserController.createUser(userAttributes).then((userCreated) => {
      if (userCreated === "User already registered") {
         return res.status(400).send(userCreated);

      }
      const token = userCreated.generateAuthToken();
      allyAttributes['fk_id_user'] = userCreated.id_user;
      Ally.create(
         allyAttributes
      ).then((allyCreated) => {
         if (allyCreated) {
            return res.header('x-auth-token', token).status(200)
               .send(_.assign(_.omit(userCreated.dataValues, ['user_password']), _.omit(allyCreated.dataValues, ['fk_id_user'])));

         } else {
            return res.status(500).send("No se pudo crear el elemento");

         }
      }).catch((error) => {
         console.log(error)
         return res.status(500).send(error);

      });
   }).catch((error) => {
      console.log(error)
      return res.status(500).send(error);

   })
}