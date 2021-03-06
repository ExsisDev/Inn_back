const Proposal = require('../models/Proposal');
const Ally = require('../models/Ally');
const ProposalState = require('../models/ProposalState');
const Challenge = require('../models/Challenge');
const Company = require('../models/Company');
const ChallengeCategory = require('../models/ChallengeCategory');
const ChCategories = require('../models/ChCategory');
const Resource = require('../models/Resource');
const { validateBodyProposalCreation, validateBodyProposalUpdate } = require('../schemas/Proposal.validation');
const config = require('config');
const jwt = require('jsonwebtoken');
const { challengeStateEnum } = require('../models/Enums/Challenge_state.enum');
const { proposalStateEnum } = require('../models/Enums/Proposal_state.enum');
const Mailer = require('../mailer/mailer');
const { userRoleEnum } = require('../models/Enums/User_role.enums');
const User = require('../models/User');

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
   let responseCreation, recipient;
   Proposal.create(
      newProposal
   ).then((result) => {
      if (result) {
         responseCreation = result;
         return User.findOne({ where: { fk_id_role: userRoleEnum.get('ADMINISTRATOR').value } });
      }
      return res.status(500).send(config.get('unableToCreate'));
   }).then((admin) => {
      recipient = admin.user_email;
      // recipient = "dago.fonseca@exsis.com.co";
      return Challenge.findByPk(newProposal.fk_id_challenge);
   }).then((challenge) => {
      let creationDate = new Date(responseCreation.created_at);
      let msg = `Se recibió una nueva propuesta para el reto ${challenge.challenge_name} el ${creationDate}`;
      Mailer.sendTextMail(recipient, msg);
      return res.status(200).send(responseCreation);
   }).catch((error) => {
      if (error.errors !== undefined && error.errors[0].type === "unique violation") {
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
 * Contar los elementos totales del estado
 * 
 * @param {String} state 
 */
function countElementsByState(state, id_user) {
   return Proposal.count({
      include: [{
         model: ProposalState,
         where: {
            id_proposal_state: state
         }
      }, {
         model: Ally,
         where: {
            fk_id_user: id_user
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
         model: Ally,
         where: {
            fk_id_user: id_user
         },
      }],
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


//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------


/**
 * Actualizar los estados de la propuesta y el reto a asignados.
 * @param {*} req 
 * @param {*} res 
 */
export async function updateProposalByChallengeAndAlly(req, res) {
   let challenge_id = req.params.id_challenge;
   let ally_id = req.params.id_ally;

   try {
      await assignProposalByChallengeAndAlly(challenge_id, ally_id);
      console.log(1)
      await assignChallengeById(challenge_id);
      console.log(2)
      await changeProposalStateToRejected(challenge_id);
      console.log(3)
      return res.status(200).send({ msg: "Propuesta asignada correctamente" });
   } catch (error) {
      console.log(error);
      return res.status(500).send(error);
   }
}


/**
 * Actualizar el estado de la propuesta de "SEND" a "ASSIGNED"
 * @param {*} id_challenge 
 * @param {*} id_ally 
 */
function assignProposalByChallengeAndAlly(id_challenge, id_ally) {
   return Proposal.update(
      {
         fk_id_proposal_state: proposalStateEnum.get(`ASSIGNED`).value
      }, {
      where: {
         fk_id_challenge: id_challenge,
         fk_id_ally: id_ally
      }
   });
}


/**
 * Actualizar el estado del reto de "SEND" a "ASSIGNED"
 * @param {*} id_challenge 
 * @param {*} id_ally 
 */
function assignChallengeById(id_challenge) {
   return Challenge.update(
      {
         fk_id_challenge_state: challengeStateEnum.get('ASSIGNED').value
      }, {
      where: {
         id_challenge: id_challenge
      }
   }
   );
}

/**Change state  */
function changeProposalStateToRejected(id_challenge) {
   return Proposal.update(
      {
         fk_id_proposal_state: proposalStateEnum.get('REJECTED').value
      }, {
      where: {
         fk_id_challenge: id_challenge,
         fk_id_proposal_state: 1
      }
   });
}


//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------


/**
 * Actualizar la propuesta pasando en el body los atributos
 * @param {*} req 
 * @param {*} res 
 */
export async function updateProposal(req, res) {
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


//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------


/**
 * Obtener propuestas asignada al reto
 * @param {*} req 
 * @param {*} res 
 */
export async function getProposalAssignedByChallenge(req, res) {
   Proposal.findAll({
      where: {
         fk_id_challenge: req.params.idChallenge,
         fk_id_proposal_state: proposalStateEnum.get('ASSIGNED').value
      }
   }).then((result) => {
      return result ? res.send(result) : res.status(404).send(config.get('emptyResponse'));

   }).catch((error) => {
      return res.status(500).send(config.get('seeLogs'));
   })
}


//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------


/**
 * Obtener propuestas asignada al reto
 * @param {*} req 
 * @param {*} res 
 */
export async function getProposalFinishedByChallenge(req, res) {
   Proposal.findAll({
      include: [{
         model: Challenge,
         attributes: ['final_comment']
      }],
      where: {
         fk_id_challenge: req.params.idChallenge,
         fk_id_proposal_state: proposalStateEnum.get('FINISHED').value
      }
   }).then((result) => {
      return result ? res.send(result) : res.status(404).send(config.get('emptyResponse'));

   }).catch((error) => {
      console.log(error)
      return res.status(500).send(config.get('seeLogs'));
   })
}