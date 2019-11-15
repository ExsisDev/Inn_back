"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userStateEnum = void 0;

var Enum = require('enum');

var userStateEnum = new Enum({
  'Active': 1,
  'Inactive': 2,
  'Locked': 3
});
exports.userStateEnum = userStateEnum;