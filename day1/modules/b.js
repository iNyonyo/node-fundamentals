const counter = require("./counter");

counter.increment();

// Predicted
/* The count will increase anytime count is called. */

// Actual
/* The count increased anytime count is called. */

// Why 
/* when called, increment will access the count 
propety and increase the number there. */