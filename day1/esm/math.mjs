export default function message(){
    console.log(`I am a default function`);
}

export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;

// Predicted
/* The file exports one default function called message and two named exports, add and sub. */

// Actual
/* The default function can be imported separately, while add and sub must be imported using their named exports. 
The arithmetic functions return the sum and difference of two numbers. */

// Why
/* export default defines the module's default export. export const creates named exports.
*/