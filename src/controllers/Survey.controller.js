const { validateBodySurveyCreation, validateBodySurveyUpdate, validateBodyAnswers } = require('../schemas/Survey.validation');
const Challenge = require('../models/Challenge');
const Survey = require('../models/Survey');
const SurveyQuestion = require('../models/SurveyQuestion');
const Question = require('../models/Question');
const AnswerOption = require('../models/AnswerOption');


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
 * Crear encuesta
 * 1. Creando encuesta vacia
 * 2. Obteniendo las preguntas activas
 * 3. Enlazando las preguntas con la encuesta creada
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function createSurvey(bodySurvey) {
	// const bodyAttributes = getValidParams(req, res, validateBodySurveyCreation);

	try {
		let emptySurvey = await createEmptySurvey(bodySurvey);
		let allQuestions = await getAllQuestions();
		allQuestions.map(async (question) => {
			await linkQuestionWithSurvey(question, emptySurvey);
		});

		// return surveyCreated ? res.status(200).send(surveyCreated) : res.status(500).send("No se pudo crear el elemento");
		return emptySurvey;

	} catch (error) {
		// return res.status(500).send(error);
		throw error;

	}
}

/**
 * Crear encuesta vacia
 * @param {Object} bodyAttributes 
 */
function createEmptySurvey(bodyAttributes) {
	return Survey.create(bodyAttributes).then((result) => {
		return result ? result : undefined;

	}).catch((error) => {
		throw error;

	})
}

/**
 * Obtener las preguntas activas
 */
function getAllQuestions() {
	return Question.findAll({
		where: {
			question_is_active: true
		}
	}).then((result) => {
		return result ? result : undefined;

	}).catch((error) => {
		throw error;
	})
}

/**
 * Enlazar encuesta con las preguntas
 * 
 * @param {Object} question 
 * @param {Object} survey 
 * 
 */
function linkQuestionWithSurvey(question, survey) {
	return SurveyQuestion.create({
		fk_id_survey: survey.id_survey,
		fk_id_question: question.id_question,
		answer: ""
	}).then((result) => {
		return result ? result : undefined;

	}).catch((error) => {
		throw error;

	});
}

/**
 * Obetener el id_survey para el reto
 * 
 * @param {Object} id_challenge
 * 
 */
function getSurveyByChallenge(id_challenge_temp) {

	let id_survey_temp = 0;
	return Challenge.findByPk(
		id_challenge_temp
	).then((result) => {
		id_survey_temp = result.fk_id_survey;
		console.log("Impresion 2: " + id_survey_temp);
		return id_survey_temp;
	}).catch((error) => {
		console.log(error);
		return res.status(500).send(error);
	});
}

export async function getQuestionsBySurvey(req, res) {
	let id_challenge_temp = req.params.id_challenge;
	console.log("Impresion 1: " + id_challenge_temp);
	let id_survey_temp = await getSurveyByChallenge(id_challenge_temp);
	console.log("Impresion 3: " + id_survey_temp);

	SurveyQuestion.findAll({
		where: {
			fk_id_survey: id_survey_temp
		},
		include: [{
			model: Question,
			include: [{
				model: AnswerOption,
				attributes: ['answer_option']
			}],
			attributes: ['id_question', 'question_header']
		}],
		attributes: ['fk_id_survey']
	}).then((result) => {
		let resultReturned = [];
		result.map((item) => {
			let item_tmp = {
				question_body: item.question.question_header,
				answer_option: item.question.answer_option.answer_option,
				id_question: item.question.id_question,
				id_survey: item.fk_id_survey
			};
			resultReturned.push(item_tmp);
			// return item.question.id_question
		})
		return res.status(200).send(resultReturned);
	})

}

export async function saveAnswerSurveyQuestion(req, res) {
	let answer = getValidParams(req, res, validateBodyAnswers);
	console.log("#################### Answers ############################");	
	console.log(answer);
		
		// SurveyQuestion.update(
		// 	answer, 
		// 	{
		// 	where:{
		// 		fk_id_question:,
		// 		fk_id_survey:
		// 	}
		// }).then((updated) => {
		// 	return updated ? res.status(200).send(updated) : res.status(500).send(config.get('challenge.unableToUpdate'));
		//  }).catch((error) => {
		// 	return res.status(500).send(config.get('challenge.unableToUpdate'));
		//  })
	return res.status(200).send("probando ...");

}