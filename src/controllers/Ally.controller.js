const { validateBodyAllyCreation, validateBodyAllyUpdate, validateAllyAuth } = require('../schemas/Ally.validations');
const { validateResourceCreation, validateResourceUpdate } = require('../schemas/Resource.validations');

const _ = require('lodash');
const {DateTime} = require('luxon');
const bcrypt = require('bcrypt');
const sequelize = require('../utils/database');
const Ally = require('../models/Ally');
const User = require('../models/User');
const Resource = require('../models/Resource');


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
   const userAttributes = _.pick(bodyAttributes, ['fk_id_role', 'fk_user_state', 'user_email', 'user_password']);
   const resourcesAttributes = _.pick(bodyAttributes, ['ally_resources']);

   userAttributes['user_last_login'] = DateTime.local().setZone('America/Bogota').toString();
   userAttributes['login_attempts'] = 0;

   let userVerified;
   let answer;

   try {
      userVerified = await verifyUser(userAttributes.user_email);
      if (userVerified) return res.status(400).send("El correo ya ha sido registrado");
      await hashPassword(userAttributes);
      answer = await createUserAndAlly(userAttributes, allyAttributes, resourcesAttributes);
   } 
   catch (error) {
      return res.status(400).send(error);      
   } 
   finally {
      return res.send(answer);
   }  
}


/**
 * Verificar existencia del usuario por email
 * 
 * @param {String} user_email 
 */
function verifyUser(user_email) {
   return User.findOne({
      where: { user_email }
      
   }).then((result) => {
      return result ? result : null;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Hashear la contraseña y almacenarla en userAttributes
 * 
 * @param {Object} userAttributes 
 */
function hashPassword(userAttributes) {
   return bcrypt.hash(userAttributes.user_password, 10).then((hash) => {
      userAttributes.user_password = hash;

   }).catch((error) => {
      throw error;

   });
}

/**
 * Crear el usuario, luego el aliado y por ultimo los recursos asociados al aliado.
 * Dentro de una transacción de Sequalize
 * 
 * @param {Object} userAttributes 
 * @param {Object} allyAttributes 
 */
async function createUserAndAlly(userAttributes, allyAttributes, resourcesAttributes) {
   let userCreated;
   let allyCreated;
   let resourcesCreated = [];

   try {
      await sequelize.transaction(async (t) => {
         // step 1
         userCreated = await User.create(userAttributes, { transaction: t }).then((result) => {
            allyAttributes['fk_id_user'] = result.id_user;
            return result;
         });
         // step 2 
         allyCreated = await Ally.create(allyAttributes, { transaction: t }).then((result) => {
            return result;
         });
         //step 3
         resourcesAttributes['ally_resources'].map( async (resource, t) => {
            resource['fk_id_ally'] = allyCreated.id_ally;
            let createResult = await Resource.create(resource, {transaction: t}).then((result) => {
               return result;
            })
            resourcesCreated.push( _.omit(createResult, ['fk_id_ally'])) ;
         })
      });

   } catch (error) {
      //falló cualquier transacion
      throw error;

   } finally {
      if (userCreated && allyCreated && resourceCreated) {
         const obj1 = _.omit(userCreated.dataValues, ['user_password']);
         const obj2 = _.omit(allyCreated.dataValues, ['fk_id_user']);
         const obj3 = _.omit(res)
         const answerObject = _.assign(obj1, obj2);
         return answerObject;
         
      }
   }
}