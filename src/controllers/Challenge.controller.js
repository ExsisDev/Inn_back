const { validateBodyChallengeCreation, validateBodyChallengeUpdate } = require('../schemas/Challenge.validations');
const _ = require('lodash');
const sequelize = require('../utils/database');
const Challenge = require('../models/Challenge');
const ChallengeCategory = require('../models/ChallengeCategory');
const SurveyController = require('./Survey.controller');


/**
 * Verificar la validez de los parametros del body
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
 * Crear un nuevo reto
 * 1. Creando una encuesta
 * 2. Creando el reto 
 * 3. Asociando las categorias al reto
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */
export async function createChallenge(req, res) {
   const bodyAttributes = getValidParams(req, res, validateBodyChallengeCreation);

   let bodyChallenge = _.pick(bodyAttributes, ['fk_id_challenge_state', 'fk_id_company', 'challenge_name', 'challenge_description', 'close_date']);
   let bodySurvey = _.pick(bodyAttributes, ['survey_date', 'user_id_creator']);
   let bodyCategories = _.pick(bodyAttributes, ['categories_selected']);

   let surveyCreated, challengeEmpty;

   try {
      await sequelize.transaction(async (t) => {
         surveyCreated = await SurveyController.createSurvey(bodySurvey);
         bodyChallenge['fk_id_survey'] = surveyCreated.id_survey;
         challengeEmpty = await createEmptyChallenge(bodyChallenge);
         bodyCategories.categories_selected.map(async (id_category) => {
            await linkChallengeWithCategories(challengeEmpty.id_challenge, id_category);
         });
      });

   } catch (error) {
      console.log(error);
      throw error;

   } finally {
      if (surveyCreated && challengeEmpty) {
         return surveyCreated ? res.status(200).send(surveyCreated) : res.status(500).send("No se pudo crear el elemento");
      }
      return res.status(500).send(error);
   }

}


/**
 * Crear el reto vacio
 * 
 * @param {Object} bodyChallenge
 */
function createEmptyChallenge(bodyChallenge) {
   return Challenge.create(
      bodyChallenge
   ).then((result) => {
      return result ? result : undefined;
      // return result ? res.send(result) : res.status(500).send("No se pudo crear el elemento");

   }).catch((error) => {
      throw error;
      // return res.status(500).send(error);

   });
}


/**
 * Enlazar el reto con las categorias seleccionadas
 * @param {Object}  
 */
function linkChallengeWithCategories(id_challenge, id_category) {
   return ChallengeCategory.create({
      fk_id_challenge: id_challenge,
      fk_id_category: id_category
   }).then((result) => {
      return result ? result : undefined;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Obtener todos los retos
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */
export async function getAllChallenges(req, res) {

   Challenge.findAll().then((result) => {
      return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");

   }).catch((error) => {
      return res.status(500).send(error);

   });
}