const Sequelize = require('sequelize');
const sequelize = require('../utils/database');
const Proposal = require('./Proposal');


const ProposalState = sequelize.define('proposal_states', {
   id_proposal_state: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false
   },
   proposal_state_name: {
      type: Sequelize.STRING,
      allowNull: false
   }
}, {
   timestamps: true,
   updatedAt: 'updated_at',
   createdAt: 'created_at'
});

module.exports = ProposalState;