// File Reading
const fs = require('fs');
const fsPromises = require('fs/promises');

fs.readFile('./files/file1.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log(data);

    fs.readFile('./files/file2.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        console.log(data);

        fs.readFile('./files/file3.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }

            console.log(data);
        });
    });
});


// Promises
fsPromises.readFile('./files/file1.txt', 'utf8')
    .then((dataA) => {
        console.log(dataA);
        return fsPromises.readFile('./files/file2.txt', 'utf8');
    })
    .then((dataB) => {
        console.log(dataB);
        return fsPromises.readFile('./files/file3.txt', 'utf8');
    })
    .then((dataC) => {
        console.log(dataC);
    })
    .catch((error) => {
        console.error('Error:', error);
});


// Async version
async function readFiles() {
    try{
        // Read file 1
        const data1 = await fsPromises.readFile('./files/file1.txt', 'utf8');

        const data2 = await fsPromises.readFile('./files/file2.txt', 'utf8');

        const data3 = await fsPromises.readFile('./files/file3.txt', 'utf8');

        console.log(data1);
        console.log(data2);
        console.log(data3);
    } catch (error) {
        console.error('Error:', error);
    }
}

readFiles();

// day1/07-async.js (export these)
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function retry(fn, { attempts = 3, delayMs = 500 } = {}) {
 // TODO (you): call fn(); if it throws, wait delayMs and try again,
 // up to `attempts` times in total. Re-throw the last error if all fail.

    for (let i = 0; i < attempts; i++) {
        try{
            return await fn();
        } catch (error) {
            if (i === attempts-1) {
                throw error;
            } else {
                await sleep(delayMs);
            }
        }
    }
}

function withTimeout(promise, ms) {
 // TODO (you): use Promise.race to reject with new Error('Timed out')
 // if promise does not settle within ms.
    const newPromise = new Promise((reject) => setTimeout(() => {reject(new Error('Timed out'))}, ms));

    return Promise.race([promise, newPromise]);
}

module.exports = { sleep, retry, withTimeout };

// Predicted
/*
The program will read three text files using three different approaches: nested callbacks, Promise chaining with .then(), and async/await.
*/

// Actual
/*
This is file1.
This is file1.
This is file 2.
This is file 2.
This is file 3.
This is file 3.
This is file1.
This is file 2.
This is file 3.
*/

// Why
/*
The nested callbacks ensure each subsequent read starts after the previous callback completes. 
Promise chaining uses return to pass the next Promise to the following .then(). 
The async/await approach pauses execution at each await until the file-reading Promise resolves.
*/