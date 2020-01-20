const Proposal = require('../models/Proposal');
const { validateBodyProposalCreation } = require('../schemas/Proposal.validation');
const config = require('config');


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


export async function createProposal(req, res) {
   let newProposal = getValidParams(req, res, validateBodyProposalCreation);

   Proposal.create(
     newProposal 
   ).then((result) => {
      return result ?  res.status(200).send(result) : res.status(500).send(config.get('unableToCreate'));

   }).catch((error) => {
      console.log(error.errors[0].type);
      if (error.errors[0].type === "unique violation"){
         return res.status(409).send("La propuesta ya ha sido enviada");
      }
      return res.status(500).send(error);
   
   });

}