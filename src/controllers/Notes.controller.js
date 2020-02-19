const { validateBodyNoteCreation, validateBodyNoteUpdate } = require('../schemas/Note.validation');
const Note = require('../models/Note');

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
 * Obtener las notas por reto
 * @param {*} req 
 * @param {*} res 
 */
export async function getNotesByChallenge(req, res){
   const id_challenge= req.params.id_challenge; 
   Note.findAll({
      where: {
         fk_id_challenge :id_challenge
      }
   }).then((result) => {
      return result ? res.send(result) : res.status(404).send(config.get('emptyResponse'));
   
   }).catch((error) => {
      return res.status(500).send(error);

   });
}


export async function createNote(req, res){
   const bodyAttributes = getValidParams(req, res, validateBodyNoteCreation);
   
   Note.create(
      bodyAttributes
   ).then((result) => {
      return result ? res.status(200).send(result) : res.status(500).send(config.get('unableToCreate'));
      
   }).catch((error) => {
      return res.status(500).send(error);

   });
}