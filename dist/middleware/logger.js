"use strict";

var logs = {
  logging: function logging(req, res, next) {
    console.log('Logging...');
    next();
  },
  authenticating: function authenticating(req, res, next) {
    console.log('Authenticating...');
    next();
  }
};
module.exports = logs;