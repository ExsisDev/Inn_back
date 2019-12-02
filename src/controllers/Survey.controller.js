const { validateBodySurveyCreation, validateBodySurveyUpdate } = require('../schemas/Survey.validation');
const Survey = require('../models/Survey');
const SurveyQuestion = require('../models/SurveyQuestion');
const Question = require('../models/Question');


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
 * 3. enlazando las preguntas con la encuesta creada
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