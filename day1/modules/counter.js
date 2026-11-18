console.log("counter loaded");

const counter = {
    count: 0,

    increment(){
        counter.count += 1;
    }
}


module.exports = counter;

// Predicted
/* The count will increase anytime count is called. */

// Actual
/* The count increased anytime count is called. */

// Why 
/* when called, increment will access the count 
propety and increase the number there. */