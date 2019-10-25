"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAdmin = isAdmin;

function isAdmin(req, res, next) {
  if (!req.user.is_admin) return res.status(403).send("Access denied. Only admin access");
  next();
}