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
 * categorias de especialidad del aliado.
 * 1. Se eliminan registros previos en AllyCategories asociados al aliado
 * 2. Se crean los nuevos registros en AllyCategories
 * 3. Se actualizan las horas del aliado
 * @param {*} req 
 * @param {*} res 
 */
export async function updateAlly(req, res) {
   let isThereHours, isThereCategories;
   let answer = {
      status: null,
      data: null
   }
   const id_ally = parseInt(req.params.idAlly);

   if (!Number.isInteger(id_ally) || id_ally <= 0) {
      return res.status(400).send("Id inválido. el id del aliado debe ser un entero positivo");
   }

   const bodyAttributes = getValidParams(req, res, validateBodyAllyUpdate);
   const newHours = _.pick(bodyAttributes, ['ally_month_ideation_hours', 'ally_month_experimentation_hours']);
   const newCategories = _.pick(bodyAttributes, ['ally_categories']);

   isThereCategories = !_.isEmpty(newCategories);
   isThereHours = !_.isEmpty(newHours);

   if (!isThereHours && !isThereCategories) {
      return res.status(400).send("Debe haber almenos un campo para actualizar.");
   }

   try {
      await sequelize.transaction(async (t) => {
         if (isThereCategories) {
            // Step 1
            await AllyCategory.destroy({ where: { fk_id_ally: id_ally } }, { transaction: t });
            // Step 2
            for (let newCategory of newCategories['ally_categories']) {
               let aux = {
                  fk_id_ally: id_ally,
                  fk_id_category: newCategory
               }
               await AllyCategory.create(aux, { transaction: t });
            }
         }

         if (isThereHours) {
            // Step 3
            await Ally.update(newHours, { where: { id_ally } });
         }
      });

      answer.data = await getAllyInfo(id_ally);
      answer.status = 200;

   } catch (error) {
      console.log(error);
      answer.data = "Algo salió mal. Mira los logs para mayor información";
      answer.status = 500;
   }
   return res.status(answer.status).send(answer.data);
}

/**
 * Obtener la información del aliado con sus respectivas categorías.
 * @param {Number} id_ally - Un entero que representa el id del aliado
 * @returns {Promise} - Promesa
 */
function getAllyInfo(id_ally) {
   return Ally.findOne({
      where: { id_ally },
      include: [{
         model: AllyCategory,
         include: [{
            model: AlCategory,
            attributes: ['id_category', 'category_name']
         }],
      },
      {
         model: User,
         attributes: ['user_email']
      }],
      attributes: [
         'id_ally',
         'ally_name',
         'ally_nit',
         'ally_web_page',
         'ally_phone',
         'ally_month_ideation_hours',
         'ally_month_experimentation_hours'
      ]
   }).then(result => {      
      if( result === null ){
         const error = { 
            code: 404, 
            message: "No se encontró un aliado con dicho id" 
         };
         return error;
      }
      
      let categories = [];
      let user_email = result.dataValues['user'].user_email;
      let answer = _.omit(result.dataValues, ['user']);

      result.dataValues['ally_categories'].map(category => {
         categories.push(category.al_category);
      });
      
      answer['user_email'] = user_email;
      answer['ally_categories'] = categories;
      
      return answer;
   }).catch(error => {
      console.log(error);
      throw error;
   })
}

/**
 * Obtener la información del aliado mediante el id que lo identifica.
 * @param {*} req 
 * @param {*} res 
 */
export async function getAllyById(req, res) {
   const id_ally = parseInt(req.params.idAlly);
   let answer ;

   if (!Number.isInteger(id_ally) || id_ally <= 0) {
      return res.status(400).send("Id inválido. el id del aliado debe ser un entero positivo");
   }
   try {
      answer = await getAllyInfo(id_ally);      
   } catch (error) {
      console.log(error);
      return res.status(500).send("Algo salió mal. Mira los logs para mayor información");
   }
   if(answer.code && answer.code === 404){
      return res.status(404).send(answer.message);
   }
   return res.status(200).send(answer);
}