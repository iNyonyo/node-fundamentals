const util = require('node:util');

const result = util.parseArgs({
    options: {
        name: {type: 'string'},
        times: {type: 'string'},
        help: {type: 'boolean'}
    },
    allowPositionals: true
});

const values = result.values;
const positionals = result.positionals;

function showHelp() {
    console.error(`
        Usage:
            node day1/05-process.js greet --name <name> [--times <number>]

        Example:
            node day1/05-process.js greet --name Ama --times 3
    `)
}

if (values.help || positionals[0] !== 'greet') {
    showHelp();
    process.exitCode = 1;
} else if (!values.name) {
    console.error('Error: You must provide --name');
    showHelp();
    process.exitCode = 1;
} else {
    const name = values.name;
    const times = Number(values.times) || 1;
    const greeting = process.env.GREETING || 'Hello';

    for (let i = 0; i < times; i++){
        console.log(`${greeting}, ${name}!`)
    }
}

// Predicted
/* A greeting command along with the name given for times stated */

// Actual
/*
Hello, Ama! x3
*/

//Why
/* util.parseArgs() separates named options from positional arguments. 
The program uses conditional statements to validate input, process.env to access environment variables, 
and a for loop to repeat the greeting. 
process.exitCode indicates whether the program completed successfully or encountered an issue.*/