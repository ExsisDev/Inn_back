const { validateBodySurveyCreation, validateBodySurveyUpdate } = require('../schemas/survey.validation');
const _ = require('lodash');
const Survey = require('../models/Survey');

function getValidParams(req, res, callBackValidation) {
   const { error } = callBackValidation(req.body);
   return (error) ? res.status(400).send(error.details[0].message) : req.body;
}

/**
 * Retorna todas las encuestas
 * 
 * @param {Request} req 
 * @param {Response} res
 * @return {Promise} promise 
 */

export async function getAllSurveys(req, res) {
   Survey.findAll({
      order: ['id_survey']
   }).then((result) => {
      return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
   }).catch((error) => {
      return res.status(500).send(error);
   });
}