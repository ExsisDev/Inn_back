const { validateBodyChallengeCreation, validateBodyChallengeUpdate } = require('../schemas/Challenge.validations');
const _ = require('lodash');
const Challenge = require('../models/Challenge');
const Company = require('../models/Company');


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
export async function createChallenge(req, res) {
   const bodyAttributes = getValidParams(req, res, validateBodyChallengeCreation);

   Challenge.create(
      bodyAttributes
   ).then((result) => {
      return result ? res.send(result) : res.status(404).send("No se pudo crear el elemento");

   }).catch((error) => {
      return res.status(500).send(error);

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