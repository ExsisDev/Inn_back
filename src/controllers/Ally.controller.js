const { validateBodyAllyCreation, validateBodyAllyUpdate, validateAllyAuth } = require('../schemas/Ally.validations');
const { validateResourceCreation, validateResourceUpdate } = require('../schemas/Resource.validations');

const _ = require('lodash');
const { DateTime } = require('luxon');
const bcrypt = require('bcrypt');
const sequelize = require('../utils/database');
const Ally = require('../models/Ally');
const User = require('../models/User');
const Resource = require('../models/Resource');
const AllyCategory = require('../models/AllyCategory');
const AlCategory = require('../models/AlCategory');

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
   const categories = _.pick(bodyAttributes, ['ally_categories']);

   userAttributes['user_last_login'] = DateTime.local().setZone('America/Bogota').toString();
   userAttributes['login_attempts'] = 0;

   let userVerified;
   let answer;

   try {
      userVerified = await verifyUser(userAttributes.user_email);
      if (userVerified) return res.status(400).send("El correo ya ha sido registrado");
      await hashPassword(userAttributes);
      answer = await createUserAndAlly(userAttributes, allyAttributes, resourcesAttributes, categories);
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
 * Crear el usuario, luego el aliado, continua creando los recursos asociados al aliado
 * y por ultimo crea las  categorias de interés del aliado.
 * Dentro de una transacción de Sequalize
 * 
 * @param {Object} userAttributes 
 * @param {Object} allyAttributes
 * @param {Object} resourcesAttributes es un objeto con un arreglo de Resources
 * @param {Object} categories es un objeto con un arreglo de enteros positivos
 */
async function createUserAndAlly(userAttributes, allyAttributes, resourcesAttributes, categories) {
   let userCreated;
   let allyCreated;
   let resourcesCreated = [];
   let categoriesCreated = [];

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
         for (let resource of resourcesAttributes['ally_resources']) {
            resource['fk_id_ally'] = allyCreated.id_ally;
            let createResult = await Resource.create(resource, { transaction: t }).then((result) => {
               return result;
            })
            resourcesCreated.push(_.omit(createResult.dataValues, ['fk_id_ally', 'updated_at', 'created_at']));
         }
         //step 4
         let allyCategory = {};
         for (let category of categories['ally_categories']) {
            allyCategory = {
               fk_id_ally: allyCreated.id_ally,
               fk_id_category: category
            };
            let createResult = await AllyCategory.create(allyCategory, { transaction: t }).then(result => {
               return result;
            })
            categoriesCreated.push(_.omit(createResult.dataValues, ['fk_id_ally', 'updated_at', 'created_at']));
         }
      });
   } catch (error) {
      //falló cualquier transacción
      throw error;
   } finally {
      if (userCreated && allyCreated) {
         const obj1 = _.omit(userCreated.dataValues, ['user_password']);
         const obj2 = _.omit(allyCreated.dataValues, ['fk_id_user']);
         let obj3 = { ally_resources: [] };
         let obj4 = { ally_categories: [] };
         if (resourcesCreated) {
            obj3['ally_resources'] = _.assign(resourcesCreated);
         }
         if (categoriesCreated) {
            obj4['ally_categories'] = _.assign(categoriesCreated);
         }
         const answerObject = _.assign(obj1, obj2, obj3, obj4);
         return answerObject;
      }
   }
}
/**
 * Actualizar horas de ideación, experimentación y
 * categorias de especialidad del aliado
 * @param {*} req 
 * @param {*} res 
 */
export async function updateAlly(req, res) {
   let hoursUpdated, categoriesUpdated;

   const id_ally = parseInt(req.params.idAlly);
   if (!Number.isInteger(id_ally) || id_ally <= 0) {
      return res.status(400).send("Id inválido. el id del aliado debe ser un entero positivo");
   }

   const bodyAttributes = getValidParams(req, res, validateBodyAllyUpdate);
   const newHours = _.pick(bodyAttributes, ['ally_month_ideation_hours', 'ally_month_experimentation_hours']);
   const newCategories = _.pick(bodyAttributes, ['ally_categories']);
   try {
      await sequelize.transaction(async (t) => {
         if (!_.isEmpty(newCategories)) {
            let categoriesByAlly = await findAllAllyCategoriesByAlly(id_ally);
            for (let register of categoriesByAlly) {
               if (newCategories['ally_categories'].includes(register)) {
                  _.remove(newCategories['ally_categories'], function (newCategory) {
                     return newCategory === register;
                  })
               } else {
                  await AllyCategory.destroy( { transaction: t },
                     {
                        where: {
                           fk_id_ally: id_ally,
                           fk_id_category: register
                        }
                     }                     
                  )
               }
            }
            console.log(newCategories['ally_categories']);
         }

         if (!_.isEmpty(newHours)) {
            // hoursUpdated = await Ally.update(newHours, { where: { id_ally } });
            // console.log("--------------------hoursUpdated------------------");
            // console.log(newHours);
         }
      });
   } catch (error) {
      throw error;
   }

   return res.status(400).send("probando...");
}

/**
 * Encontrar todos las categorias de un aliado
 * @param {Number} idAlly 
 */
function findAllAllyCategoriesByAlly(idAlly) {
   return AllyCategory.findAll({
      where: { 'fk_id_ally': idAlly },
      attributes: ['fk_id_category']
   }).then(result => {
      let foundCategories = [];
      result.map(category => {
         foundCategories.push(category.fk_id_category);
      })
      return foundCategories;
   }).catch(error => {
      let customError = {
         message: "findAllAllyCategoriesByAlly falló",
         details: error
      }
      throw customError;
   })
}