const CompanyCategory = require('../models/AllyCategory');


/**
 * Obtener todas las categorias de las compañias
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getAllCompanyCategories(req, res) {

   CompanyCategory.findAll().then((result) => {
      return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
   
   }).catch((error) => {
      return res.status(500).send(error);
   
   });
}