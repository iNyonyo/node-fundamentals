const http = require('http');
const { Worker } = require('worker_threads');
const path = require('path');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/fast') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Fast response' }));

    } else if (url.pathname === '/fib') {
        const n = Number(url.searchParams.get('n'));

        const worker = new Worker(
            path.join(__dirname, 'fib-worker.js'),
            { workerData: n }
        );

        worker.on('message', (result) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ result }));
        });

        worker.on('error', (error) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not found' }));
    }
});

server.listen(3000);

const child = spawn('node', ['-v']);

child.stdout.on('data', (data) => {
    console.log(data.toString());
});

child.stderr.on('data', (data) => {
    console.error(data.toString());
});

child.on('error', (error) => {
    console.error('Failed to start process:', error.message);
});

child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
});

