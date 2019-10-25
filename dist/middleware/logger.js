"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logging = logging;
exports.authenticating = authenticating;

function logging(req, res, next) {
  console.log('Logging...');
  next();
}

function authenticating(req, res, next) {
  console.log('Authenticating...');
  next();
}