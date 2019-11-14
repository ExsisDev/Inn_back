const Enum = require('enum');

export const challengeStateEnum = new Enum({
   'Send': 1,
   'Rejected': 2,
   'Assigned': 3,
   'Finished': 4,
   'Created': 5
});