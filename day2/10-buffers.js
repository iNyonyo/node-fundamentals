const fs = require('fs/promises');
const path = require('path');

const welcome = 'Akwaaba';

const emoji = 'Akwaaba 😉';

console.log(welcome.length);

console.log(Buffer.byteLength(welcome));

console.log(emoji.length);

console.log(Buffer.byteLength(emoji));

const buffer = Buffer.from(welcome);

const hexValue = buffer.toString('hex');
const base64Value = buffer.toString('base64');

const hexString = Buffer.from(hexValue, 'hex').toString('utf8');
const baseString = Buffer.from(base64Value, 'base64').toString('utf8');

console.log(`To hex: ${hexValue}`);
console.log(`To Base64: ${base64Value}`);

console.log(`From hex: ${hexString}`);
console.log(`From Base64: ${baseString}`);

const pngPath = path.join(__dirname, 'my-image.png');

async function main() {
    const data = await fs.readFile(pngPath);

    const extract = data.subarray(0, 8);

    console.log(extract.toString('hex'));

    const pngSignature = Buffer.from('89504e470d0a1a0a', 'hex');

    console.log(extract.equals(pngSignature));
}

main();

// Predicted
/*
I expected the string length and byte length to match for ordinary characters but differ for strings containing emojis. 
I also expected converting a string to hexadecimal and Base64 and back to produce the original string. 
Finally, I expected the first 8 bytes of a valid PNG file to match its standard PNG signature.
*/

// Actual
/*
7
10
12
To hex: 416b7761616261
To Base64: QWt3YWFiYQ==
From hex: Akwaaba
From Base64: Akwaaba
89504e470d0a1a0a
true
*/

// Why
/*
JavaScript's .length counts UTF-16 code units, while Buffer.byteLength() measures the actual number of bytes. 
Buffers allow strings to be encoded and decoded using formats such as hexadecimal and Base64. 
I used subarray() to extract the PNG's first 8 bytes and .equals() to check whether they matched the expected signature.
*/