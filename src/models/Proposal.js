const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const ProposalState = require('./ProposalState');
const Challenge = require('./Challenge');


const Proposal = sequelize.define('proposals', {
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
      allowNull: false,
   },
   experimentation_hours: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },
   solution_description: {
      type: Sequelize.STRING,
      allowNull: false,
   },
   proposal_resources: {
      type: Sequelize.STRING,
      allowNull: false
   }
}, {
   timestamps: true,
   updatedAt: 'updated_at',
   createdAt: 'created_at'
});

ProposalState.hasMany(Proposal, { foreignKey: 'fk_id_proposal_state', sourceKey: 'id_proposal_state' });
Proposal.belongsTo(ProposalState, { foreignKey: 'fk_id_proposal_state', targetKey: 'id_proposal_state' });

module.exports = Proposal;