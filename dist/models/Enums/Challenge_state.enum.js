"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.challengeStateEnum = void 0;

var Enum = require('enum');

var challengeStateEnum = new Enum({
  'Send': 1,
  'Rejected': 2,
  'Assigned': 3,
  'Finished': 4,
  'Created': 5
});
exports.challengeStateEnum = challengeStateEnum;