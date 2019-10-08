"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var express = require('express');

var morgan = require('morgan');

var app = express();
app.use(express.json());

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  debug('Morgan is enabled...');
}

var _default = app;
exports["default"] = _default;