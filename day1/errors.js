const fs = require('fs');
// process errors

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);

    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);

    process.exit(1);
});

try{
    throw new Error("Error test");
} catch (error) {
    console.error(error.message);
}

// With await
async function testPromise() {
    try{
        await Promise.reject(new Error('Promise failed'));
    } catch (error) {
        console.error('Caught:', error.message);
    }
}

// Without async
try{
    Promise.reject(new Error('Promise failed'));
} catch (error) {
    console.error('Caught:', error.message);
}

// callback error
fs.readFile('./files/file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(data);
});

// custom error

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

const error = new ValidationError('Invalid email');

console.log(error instanceof ValidationError);
console.log(error instanceof Error);

testPromise();

// Predicted
/* The program will demonstrate different error-handling techniques in Node.js, 
including synchronous errors, Promise rejections, callback errors, process-level error handlers, 
and custom error classes. */

// Actual
/* 
The synchronous error was caught, the awaited Promise rejection was handled, and the non-awaited rejection reached 
the unhandledRejection handler. 
Both custom error checks returned true. 
The program terminated after the unhandled rejection, so the callback output was not displayed.
*/

//Why
/*
Synchronous try/catch cannot automatically catch an unawaited Promise rejection. 
Node reports unhandled rejections through the process event handler. 
Calling process.exit(1) immediately terminates the application, preventing pending callbacks from completing.
*/