"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userStateEnum = void 0;

var Enum = require('enum');

var userStateEnum = new Enum({
  'ACTIVE': 1,
  'INACTIVE': 2,
  'LOCKED': 3
});
exports.userStateEnum = userStateEnum;