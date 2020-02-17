"use strict";

var Sequelize = require('sequelize');

var sequelize = require('../utils/database');

var Company = require('./Company');

var Proposal = require('./Proposal');

var ProposalState = require('./ProposalState');

var Challenge = sequelize.define('challenges', {
  id_challenge: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fk_id_survey: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fk_id_company: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  challenge_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  challenge_description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  fk_id_challenge_state: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  close_date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  final_comment: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: " "
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});
Company.hasMany(Challenge, {
  foreignKey: 'fk_id_company',
  sourceKey: 'id_company'
});
Challenge.belongsTo(Company, {
  foreignKey: 'fk_id_company',
  targetKey: 'id_company'
});
Challenge.hasMany(Proposal, {
  foreignKey: 'fk_id_challenge',
  sourceKey: 'id_challenge'
});
Proposal.belongsTo(Challenge, {
  foreignKey: 'fk_id_challenge',
  targetKey: 'id_challenge'
}); // Challenge.belongsTo(Survey, { foreignKey: 'fk_id_survey', targetKey: 'id_survey' });

module.exports = Challenge;