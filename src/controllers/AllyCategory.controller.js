const AllyCategory = require('../models/AllyCategory');


/**
 * Obtener todas las categorias por compañia
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getAllAllyCategories(req, res) {

   AllyCategory.findAll().then((result) => {
      return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
   
   }).catch((error) => {
      return res.status(500).send(error);
   
   });
}