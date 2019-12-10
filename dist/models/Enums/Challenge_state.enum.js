"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.challengeStateEnum = void 0;

var Enum = require('enum');

var challengeStateEnum = new Enum({
  'ASSIGNED': 1,
  'FINISHED': 2,
  'CREATED': 3
});
exports.challengeStateEnum = challengeStateEnum;