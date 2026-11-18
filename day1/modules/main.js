const counter = require("./counter");
const a = require("./a");
const b = require("./b");

const data = require("./exports");

console.log(counter);
console.log(data);
console.log(Object.keys(require.cache));

// Predicted
/* The count will be 2. */

// Actual
/* The count is 2. */

// Why 
/* when called, increment will access the count 
propety and increase the number there. */

// Exports
/* exports is a reference to modules.exports but not 
the module itself.
*/