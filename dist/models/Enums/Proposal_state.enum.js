"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proposalStateEnum = void 0;

var Enum = require('enum');

var proposalStateEnum = new Enum({
  'SEND': 1,
  'REJECTED': 2
});
exports.proposalStateEnum = proposalStateEnum;