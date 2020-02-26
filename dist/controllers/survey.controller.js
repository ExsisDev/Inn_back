"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSurvey = createSurvey;
exports.getchallangeState = getchallangeState;
exports.getQuestionsBySurvey = getQuestionsBySurvey;
exports.saveAnswerSurveyQuestion = saveAnswerSurveyQuestion;

var _require = require('../schemas/Survey.validation'),
    validateBodySurveyCreation = _require.validateBodySurveyCreation,
    validateBodySurveyUpdate = _require.validateBodySurveyUpdate,
    validateBodyAnswers = _require.validateBodyAnswers;

var Challenge = require('../models/Challenge');

var Survey = require('../models/Survey');

var SurveyQuestion = require('../models/SurveyQuestion');

var Question = require('../models/Question');

var AnswerOption = require('../models/AnswerOption');
/**
 * Verificar la validéz de los parametros del body
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {CallableFunction} callBackValidation 
 */


function getValidParams(req, res, callBackValidation) {
  var _callBackValidation = callBackValidation(req.body),
      error = _callBackValidation.error;

  return error ? res.status(400).send(error.details[0].message) : req.body;
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


function createSurvey(bodySurvey) {
  var emptySurvey, allQuestions;
  return regeneratorRuntime.async(function createSurvey$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(createEmptySurvey(bodySurvey));

        case 3:
          emptySurvey = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(getAllQuestions());

        case 6:
          allQuestions = _context2.sent;
          allQuestions.map(function _callee(question) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(linkQuestionWithSurvey(question, emptySurvey));

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            });
          }); // return surveyCreated ? res.status(200).send(surveyCreated) : res.status(500).send("No se pudo crear el elemento");

          return _context2.abrupt("return", emptySurvey);

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          throw _context2.t0;

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
}
/**
 * Crear encuesta vacia
 * @param {Object} bodyAttributes 
 */


function createEmptySurvey(bodyAttributes) {
  return Survey.create(bodyAttributes).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
    throw error;
  });
}
/**
 * Obtener las preguntas activas
 */


function getAllQuestions() {
  return Question.findAll({
    where: {
      question_is_active: true
    }
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
    throw error;
  });
}

function getchallangeState(req, res) {
  var challenge_state_temp = 0;
  Challenge.findByPk(req.params.id_challenge).then(function (result) {
    challenge_state_temp = result.fk_id_challenge_state;
    console.log("Aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", challenge_state_temp);
    return challenge_state_temp;
  })["catch"](function (error) {
    return res.status(500).send(error);
  });
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
  }).then(function (result) {
    return result ? result : undefined;
  })["catch"](function (error) {
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
  var id_survey_temp = 0;
  return Challenge.findByPk(id_challenge_temp).then(function (result) {
    id_survey_temp = result.fk_id_survey;
    return id_survey_temp;
  })["catch"](function (error) {
    return res.status(500).send(error);
  });
}

function getQuestionsBySurvey(req, res) {
  var id_challenge_temp, id_survey_temp;
  return regeneratorRuntime.async(function getQuestionsBySurvey$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id_challenge_temp = req.params.id_challenge;
          _context3.next = 3;
          return regeneratorRuntime.awrap(getSurveyByChallenge(id_challenge_temp));

        case 3:
          id_survey_temp = _context3.sent;
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
          }).then(function (result) {
            var resultReturned = [];
            result.map(function (item) {
              var item_tmp = {
                question_body: item.question.question_header,
                answer_option: item.question.answer_option.answer_option,
                id_question: item.question.id_question,
                id_survey: item.fk_id_survey
              };
              resultReturned.push(item_tmp); // return item.question.id_question
            });
            return res.status(200).send(resultReturned);
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function saveAnswerSurveyQuestion(req, res) {
  var answer;
  return regeneratorRuntime.async(function saveAnswerSurveyQuestion$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          answer = getValidParams(req, res, validateBodyAnswers);
          answer.forEach(function (element) {
            SurveyQuestion.update(element, {
              where: {
                fk_id_question: element.fk_id_question,
                fk_id_survey: element.fk_id_survey
              }
            }).then(function (updated) {
              return updated ? res.status(200).send(updated) : res.status(500).send(config.get('surveyQuestion.unableToUpdate'));
            })["catch"](function (error) {
              return res.status(500).send(config.get('surveyQuestion.unableToUpdate'));
            });
          });
          return _context4.abrupt("return", res.status(200).send("probando ..."));

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
}