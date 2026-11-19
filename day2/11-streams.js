const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const zlib = require('zlib');
const { Transform } = require('stream');

const tmpDir = path.join(__dirname, 'tmp');
const logPath = path.join(tmpDir, 'large.log');
const copyPath = path.join(tmpDir, 'copy-readfile.log');
const pipelinePath = path.join(tmpDir, 'copy-pipeline.log');
const gzipPath = path.join(tmpDir, 'large.log.gz');
const upperCasePath = path.join(tmpDir, 'uppercase.log');

fs.mkdirSync(tmpDir, { recursive: true });

const writeStream = fs.createWriteStream(logPath);

function fakeLog() {
    const messages = [
        'User logged in successfully',
        'Database connection established',
        'Request received',
        'File uploaded successfully',
        'Error processing request'
    ];

    const message = messages[Math.floor(Math.random() * 5)];

    const timestamp = new Date().toISOString();
    return `${timestamp} INFO ${message}\n`;
}

const targetSize = 209715200;
let written = 0;

async function generateLogs() {
    while (written < targetSize) {
        const line = fakeLog();

        const lineSize = Buffer.byteLength(line);

        const canContinue = writeStream.write(line);

        written += lineSize;

        if (!canContinue) {
            await new Promise(resolve => {
                writeStream.once('drain', resolve);
            });
        }
    }

    writeStream.end();

    await new Promise(resolve => {
        writeStream.on('finish', resolve);
    });

    console.log(`Finished writing ${written} bytes.`);
}

async function copyWithReadFile() {
    const before = process.memoryUsage().rss;

    const read = await fs.promises.readFile(logPath);

    await fs.promises.writeFile(copyPath, read);

    const after = process.memoryUsage().rss;

    console.log(`Before: ${before}`);
    console.log(`After: ${after}`);
    console.log(`Difference: ${after - before}`);
}

async function copyWithPipeline() {
    const before = process.memoryUsage().rss;

    const read = fs.createReadStream(logPath);

    const write = fs.createWriteStream(pipelinePath);

    await pipeline(read, write);

    const after = process.memoryUsage().rss;

    console.log(`Before: ${before}`);
    console.log(`After: ${after}`);
    console.log(`Difference: ${after - before}`);
}

async function main() {
    await generateLogs();
    await copyWithReadFile();
    await copyWithPipeline();
    await compressFile();
    await convertToUpperCase();

    const logSize = await fs.promises.stat(logPath);
    const zipSize = await fs.promises.stat(gzipPath);

    const compressionRatio = (zipSize.size / logSize.size) * 100;

    console.log(`Original size: ${logSize.size} bytes`);
    console.log(`Compressed size: ${zipSize.size} bytes`);
    console.log(`Compression ratio: ${compressionRatio.toFixed(2)}%`);
}

async function compressFile() {
    await pipeline(fs.createReadStream(logPath), zlib.createGzip(), fs.createWriteStream(gzipPath));
}

async function convertToUpperCase() {
    const upperCaseTransform = new Transform({
        transform(chunk, encoding, callback) {
            const upperCase = chunk.toString().toUpperCase();
            callback(null, upperCase);
        }
    });

    await pipeline(
        fs.createReadStream(logPath),
        upperCaseTransform,
        fs.createWriteStream(upperCasePath)
    );

    console.log('Uppercase conversion completed.');
}

main();

// Predicted
/*
I expected the write stream to generate a large log file while handling backpressure. 
I also expected readFile() to use more memory than pipeline(), Gzip to reduce the file size, and 
the Transform stream to convert all log entries to uppercase.
*/

// Actual
/*
The log file was generated successfully. readFile() caused a significant increase in memory usage, 
while pipeline() copied the file using streams. 
Gzip compressed the log file, and the Transform stream produced an uppercase version of the original file.
*/

// Why
/*
Streams process data in smaller chunks instead of loading an entire large file into memory. 
Backpressure prevents the write stream from being overwhelmed when data arrives faster than it can be written. 
Gzip compresses data to reduce file size, while Transform streams allow data to be modified as it passes through a pipeline.
*/

