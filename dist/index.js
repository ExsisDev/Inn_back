"use strict";

var app = require('./app');

require("@babel/polyfill");

var port = process.env.PORT || 3000;
/**
 * Lanzador del servidor express
 */

function main() {
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(app.listen(port, function () {
            return console.log("Listening on port ".concat(port, " ..."));
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

main();