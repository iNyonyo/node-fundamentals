const fs = require('fs');
const path = require('path');

const tmpDir = path.join(__dirname, 'tmp');
const logPath = path.join(tmpDir, 'large.log');

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

generateLogs();