const fs = require('fs');

console.log('1: start');

setTimeout(() => console.log('2: timeout'), 0);

setImmediate(() => console.log('3: immediate'));

Promise.resolve().then(() => console.log('4: promise'));

process.nextTick(() => console.log('5: nextTick'));

fs.readFile(__filename, () => {
    console.log('6: readFile callback');
    setTimeout(() => console.log('7: timeout inside I/O'), 0);
    setImmediate(() => console.log('8: immediate inside I/O'));
});

(async () => { console.log('9: async start'); await null; console.log('10: after await'); })();

console.log('11: end');

//Prediction
/* 
1. fs module is imported as fs and 1: start is 
displayed at the console.
2. 11: end is displayed in the console
3. 5: nextTick is displayed 
4. 4: promise is displayed
5. 2: timeout is displayed
6. 3: immediate is displayed
7. 9: async start is displayed
8. 10: after wait is displayed
9. 6: read file callback is displayed
10. 7: timeout inside I/O is displayed
11. 8: immediate inside I/O is displayed
*/

// Actual
/* 
1: start
9: async start
11: end
5: nextTick
4: promise
10: after await
2: timeout
3: immediate
6: readFile callback
8: immediate inside I/O
7: timeout inside I/O
*/

// Why
/*
All synchronous code runs first, followed by microtasks,
then timers, checks, poll, then the inside callback
*/