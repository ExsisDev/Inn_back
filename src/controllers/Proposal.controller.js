import { validateBodyProposalUpdate } from '../schemas/Proposal.validation';

const Proposal = require('../models/Proposal');
const Ally = require('../models/Ally');
const ProposalState = require('../models/ProposalState');
const Challenge = require('../models/Challenge');
const Company = require('../models/Company');
const ChallengeCategory = require('../models/ChallengeCategory');
const ChCategories = require('../models/ChCategory');
const Resource = require('../models/Resource');
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


//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------


/**
 * Encontrar las propuestas del usuario (con el id del token) dado un estado y una página
 * @param {*} req 
 * @param {*} res 
 */
export async function searchProposalByState(req, res) {

   let itemsByPage = 5;
   let page = req.params.page;
   let state = proposalStateEnum.get(`${req.params.status.toUpperCase()}`).value;
   let elementsCountByState;
   let elementsByState;
   const tokenElements = jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'));

   try {
      elementsCountByState = await countElementsByState(state, tokenElements.id_user);
      elementsByState = await getChallengesByPageAndState(itemsByPage, page, state, tokenElements.id_user);
      for (let challenge of elementsByState) {
         challenge.dataValues['categories'] = await getCategoriesByChallenge(challenge.challenge.id_challenge);
      }

   } catch (error) {
      console.log(error);
      return res.status(500).send(error);

   } finally {
      //return elementsCountByState && elementsByState ? res.send({ result: elementsByState, totalElements: elementsCountByState }) : res.status(404).send(config.get('emptyResponse'));
      return res.send({ result: elementsByState, count: elementsCountByState });
   }
}

/**
 * Encontrar las propuestas por el id del reto, dado un estado y una página
 * @param {*} req 
 * @param {*} res 
 */
export async function searchProposalByChallengeAndState(req, res) {

   let itemsByPage = 5;
   let page = req.params.page;
   let state = proposalStateEnum.get(`${req.params.status.toUpperCase()}`).value;
   // let elementsCountByState;
   let proposalsByState;
   let challenge_id = req.params.id_challenge;

   try {
      // elementsCountByState = await countElementsByState(state, tokenElements.id_user);
      proposalsByState = await getProposalsByChalengeAndState(itemsByPage, page, state, challenge_id);
      for (let challenge of proposalsByState) {
         challenge.dataValues['categories'] = await getCategoriesByChallenge(challenge.challenge.id_challenge);
      }
      for (let proposal of proposalsByState) {
         proposal.dataValues['resources'] = await getResourcesByAlly(proposal.dataValues.fk_id_ally);
      }

      return res.send({ result: proposalsByState });
   } catch (error) {
      console.log(error);
      return res.status(500).send(error);
   }
}


/**
 * Contar los elementos totales del estado
 * 
 * @param {String} state 
 */
function countElementsByState(state, id_user) {
   return Proposal.count({

      where: {
         fk_id_ally: id_user
      },
      include: [{
         model: ProposalState,
         where: {
            id_proposal_state: state
         }
      }]
   }).then((result) => {
      return result ? result : 0;

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
function getChallengesByPageAndState(itemsByPage, page, state, id_user) {
   return Proposal.findAll({
      offset: (page - 1) * itemsByPage,
      limit: 5,
      order: [
         ['created_at', 'DESC']
      ],
      where: {
         fk_id_ally: id_user
      },
      include: [{
         model: Challenge,
         include: [{
            model: Company
         }]
      },
      {
         model: ProposalState,
         where: {
            id_proposal_state: state
         }
      }],
   });
}

/**
 * Encontrar los elementos por estado, pagina y cantidad
 * 
 * @param {Number} itemsByPage 
 * @param {Number} page 
 * @param {String} state 
 */
function getProposalsByChalengeAndState(itemsByPage, page, state, challenge_id) {
   return Proposal.findAll({
      offset: (page - 1) * itemsByPage,
      limit: 5,
      order: [
         ['created_at', 'DESC']
      ],
      where: {
         fk_id_challenge: challenge_id
      },
      include: [{
         model: Challenge,
         include: [{
            model: Company
         }]
      }, {
         model: ProposalState,
         where: {
            id_proposal_state: state
         }
      }, {
         model: Ally
      }],
   }).then((result) => {
      return result ? result : null;

   }).catch((error) => {
      throw error;

   });
}

/**
 * Obtener todos los recursos asociados a un aliado
 * @param {Numeric} idAlly 
 */
function getResourcesByAlly(idAlly) {
   return Resource.findAll({
      where: {
         fk_id_ally: idAlly
      },
      attributes: ['id_resource', 'resource_name', 'resource_profile', 'resource_experience']
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


//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------


export async function updateProposalState(req, res) {
   const bodyAttributes = getValidParams(req, res, validateBodyProposalUpdate);

   Proposal.update(
      bodyAttributes,
      {
         where: {
            fk_id_challenge: req.params.idChallenge,
            fk_id_ally: req.params.idAlly
         }
      }).then((updated) => {
         return updated ? res.status(200).send(updated) : res.status(500).send(config.get('challenge.unableToUpdate'));
      }).catch((error) => {
         return res.status(500).send(config.get('challenge.unableToUpdate'));
      })
} 