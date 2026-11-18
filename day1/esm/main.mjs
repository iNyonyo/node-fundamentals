import message from "./math.mjs";
import { add } from "./math.mjs";
import { sub } from "./math.mjs";

import counter from "../modules/counter.js";

import { readFile } from "fs/promises";

const data = await readFile('./input.txt', 'utf8');

console.log(data);

// Predicted
/*
The code imports the default message function, the named add and sub functions, a counter function, and Node's readFile function. 
It then reads input.txt and stores its contents in data.
The data is then displayed in console.
*/

// Actual
/*
all imports resolve successfully and input.txt file contents are read as a string and printed to the console.
*/

//Why
/*
ES modules allow default and named imports. 
fs/promises provides Promise-based file operations, and await pauses execution until the file-reading Promise settles.
*/