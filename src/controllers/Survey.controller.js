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
 * Crear aliado
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function createSurvey(req, res) {
	const bodyAttributes = getValidParams(req, res, validateBodySurveyCreation);

	try {
		let surveyCreated = await createEmptySurvey(bodyAttributes);
		let allQuestions = await getAllQuestions();
		allQuestions.map(async (item) => {
			await linkQuestionWithSurvey(item, surveyCreated);
		});

		return surveyCreated ? res.status(200).send(surveyCreated) : res.status(500).send("No se pudo crear el elemento");

	} catch (error) {
		return res.status(500).send(error);

	} finally {

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