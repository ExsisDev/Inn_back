const Company = require('../models/Company');
const config = require('config');


/**
 * Obtener todas las compañias
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getAllCompanies(req, res) {

   Company.findAll().then((result) => {
      return result ? res.send(result) : res.status(404).send(config.get('emptyResponse'));
   
   }).catch((error) => {
      return res.status(500).send(error);
   
   });
}