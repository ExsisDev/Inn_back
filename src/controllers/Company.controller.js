const Company = require('../models/Company');


/**
 * Obtener todas las compañias
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function getAllCompanies(req, res) {

   Company.findAll().then((result) => {
      return result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
   
   }).catch((error) => {
      return res.status(500).send(error);
   
   });
}