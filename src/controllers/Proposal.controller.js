const Proposal = require('../models/Proposal');
const ProposalState = require('../models/ProposalState');
const Challenge = require('../models/Challenge');
const { validateBodyProposalCreation } = require('../schemas/Proposal.validation');
const config = require('config');
const jwt = require('jsonwebtoken');
const { challengeStateEnum } = require('../models/Enums/Challenge_state.enum');
const { proposalStateEnum } = require('../models/Enums/Proposal_state.enum');

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

export async function searchProposalByState1(req, res) {
   // const page, 
   // console.log(req.params.state)
   // const tokenElements = jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'));







}

export async function createProposal(req, res) {
   let newProposal = getValidParams(req, res, validateBodyProposalCreation);

   Proposal.create(
      newProposal
   ).then((result) => {
      return result ? res.status(200).send(result) : res.status(500).send(config.get('unableToCreate'));

   }).catch((error) => {
      if (error.errors[0].type === "unique violation") {
         return res.status(409).send("La propuesta ya ha sido enviada");
      }
      return res.status(500).send(error);

   });

}




export async function searchProposalByState(req, res) {

   let itemsByPage = 5;
   let page = req.params.page;
   let state = proposalStateEnum.get(`${req.params.status.toUpperCase()}`).value;
   let elementsCountByState;
   let elementsByState;
   const tokenElements = jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'));

   try {
      elementsCountByState = await countElementsByState(state, tokenElements.id_user);
      // elementsByState = await getChallengesByPageAndState(itemsByPage, page, state);
      // for (let challenge of elementsByState) {
      //    challenge.dataValues['categories'] = await getCategoriesByChallenge(challenge.id_challenge);
      // }

   } catch (error) {
      console.log(error);
      return res.status(500).send(error);

   } finally {
      //return elementsCountByState && elementsByState ? res.send({ result: elementsByState, totalElements: elementsCountByState }) : res.status(404).send(config.get('emptyResponse'));
      return res.send({count: elementsCountByState});
   }
}


/**
 * Contar los elementos totales del estado
 * 
 * @param {String} state 
 */
function countElementsByState(state, id_user) {
   return Challenge.count({

      include: [{
         model: Proposal,
         where: {
            fk_id_ally: id_user
         },
         include: [{
            model: ProposalState,
            where: {
               id_proposal_state: state
            }
         }]
      }]
   }).then((result) => {
      console.log("hay "+result)
      return result ? result : null;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Encontrar los elementos por estado, pagina y cantidad
 * 
 * @param {Number} itemsByPage 
 * @param {Number} page 
 * @param {String} state 
 */
function getChallengesByPageAndState(itemsByPage, page, state) {
   return Challenge.findAll({
      offset: (page - 1) * itemsByPage,
      limit: itemsByPage,
      order: [
         ['created_at', 'DESC']
      ],
      where: {
         fk_id_challenge_state: state,
         is_deleted: false
      },
      include: [{
         model: Company,
         attributes: ['company_name', 'company_description']
      }]

   }).then((result) => {
      return result ? result : undefined;

   }).catch((error) => {
      throw error;

   });
}


/**
 * Encontrar todas los nombres de categorias por reto 
 * 
 * @param {Number} id_challenge 
 */
function getCategoriesByChallenge(id_challenge) {
   return ChallengeCategory.findAll({
      where: {
         fk_id_challenge: id_challenge
      },
      include: [{
         model: ChCategories,
         attributes: ['category_name']
      }],
      attributes: []

   }).then((result) => {
      let AllCategoriesResult = [];
      result.map((category) => {
         AllCategoriesResult.push(category.ch_category.category_name);
      });
      return result ? AllCategoriesResult : undefined;

   }).catch((error) => {
      throw error;

   });
}
