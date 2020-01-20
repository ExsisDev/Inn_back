"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Proposal = sequelize.define('proposals', {
  fk_id_challenge: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fk_id_ally: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fk_id_proposal_state: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true
  },
  ideation_hours: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  experimentation_hours: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  solution_description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  proposal_is_assigned: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});
module.exports = Proposal;