const AlCategory = require('../models/AlCategory');
const config = require('config');


/**
 * Obtener todas las categorias de los aliados o compañias
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getAllAlCategories(req, res) {

   AlCategory.findAll().then((result) => {
      return result ? res.send(result) : res.status(404).send(config.get('emptyResponse'));
   
   }).catch((error) => {
      return res.status(500).send(error);
   
   });
}