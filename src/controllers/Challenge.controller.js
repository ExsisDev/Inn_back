const { validateBodyChallengeCreation, validateBodyChallengeUpdate } = require('../schemas/Challenge.validations');
const _ = require('lodash');
const sequelize = require('../utils/database');
const Challenge = require('../models/Challenge');
const Company = require('../models/Company');
const ChallengeCategory = require('../models/ChallengeCategory');
const ChCategories = require('../models/ChCategory');
const SurveyController = require('./Survey.controller');
const { challengeStateEnum } = require('../models/Enums/Challenge_state.enum');


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
         for (let id_category of bodyCategories.categories_selected) {
            await linkChallengeWithCategories(challengeEmpty.id_challenge, id_category);
         }
      });

   } catch (error) {
      console.log(error);
      throw error;

   } finally {
      if (surveyCreated && challengeEmpty) {
         return challengeEmpty ? res.status(200).send(challengeEmpty) : res.status(500).send("No se pudo crear el elemento");

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

   }).catch((error) => {
      throw error;

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
 * Obtener los retos por pàgina y por estado, con total y categorias
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {Promise} promise
 */
export async function getChallengesByPageAndStatus(req, res) {
   let itemsByPage = 5;
   let page = req.params.page;
   let state = challengeStateEnum.get(`${req.params.status.toUpperCase()}`).value;
   let elementsCountByState;
   let elementsByState = [];

   try {
      elementsCountByState = await countElementsByState(state);
      elementsByState = await findChallengesByPageAndState(itemsByPage, page, state);
      for (let challenge of elementsByState) {
         challenge.dataValues['categories'] = await findCategoriesByChallenge(challenge.id_challenge);
      }

   } catch (error) {
      console.log(error);
      return res.status(500).send(error);

   } finally {
      return elementsCountByState && elementsByState ? res.send({ result: elementsByState, totalElements: elementsCountByState }) : res.status(404).send("No hay elementos disponibles");

   }
}


/**
 * Contar los elementos totales del estado
 * 
 * @param {String} state 
 */
function countElementsByState(state) {
   return Challenge.count({
      where: {
         'fk_id_challenge_state': state
      }
   }).then((result) => {
      return result ? result : undefined;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Encontrar los elementos por estado, pagina y cantidad
 * 
 * @param {Number} itemsByPage 
 * @param {Number} page 
 * @param {String} state 
 */
function findChallengesByPageAndState(itemsByPage, page, state) {
   return Challenge.findAll({
      offset: (page - 1) * itemsByPage,
      limit: itemsByPage,
      order: [
         ['created_at', 'DESC']
      ],
      where: {
         'fk_id_challenge_state': state
      },
      include: [{
         model: Company,
         attributes: ['company_name', 'company_description']
      }]

   }).then((result) => {
      return result ? result : undefined;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Encontrar todas los nombres de categorias por reto 
 * 
 * @param {Number} id_challenge 
 */
function findCategoriesByChallenge(id_challenge) {
   return ChallengeCategory.findAll({
      where: {
         'fk_id_challenge': id_challenge
      },
      include: [{
         model: ChCategories,
         attributes: ['category_name']
      }],
      attributes: []

   }).then((result) => {
      let AllCategoriesResult = [];
      result.map((category) => {
         AllCategoriesResult.push(category.ch_category.category_name);
      });
      return result ? AllCategoriesResult : undefined;

   }).catch((error) => {
      throw error;

   });
}