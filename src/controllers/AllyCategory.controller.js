const AllyCategory = require('../models/AllyCategory');
const config = require('config');


/**
 * Obtener todas las categorias por compañia
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getAllAllyCategories(req, res) {

   AllyCategory.findAll().then((result) => {
      return result ? res.send(result) : res.status(404).send(config.get('emptyResponse'));
   
   }).catch((error) => {
      return res.status(500).send(error);
   
   });
}