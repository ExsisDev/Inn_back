const Enum = require('enum');

export const proposalStateEnum = new Enum({
   'SEND': 1,
   'REJECTED': 2,
   'ASSIGNED': 3,
   'FINISHED': 4
});