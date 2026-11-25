
const http = require('http');
const setupShutdown = require('./15-shutdown.js');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');

    // GET /health
    if (req.method === 'GET' && url.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
    }

    // POST /echo
    if (req.method === 'POST' && url.pathname === '/echo') {
        let body = '';
        let bodySize = 0;
        let tooLarge = false;

        req.on('data', (chunk) => {
            bodySize += chunk.length;

            if (bodySize > 1024 * 1024) {
                tooLarge = true;
                body = '';
                return;
            }

            if (!tooLarge) {
                body += chunk.toString();
            }
        });

        req.on('end', () => {
            if (tooLarge) {
                res.writeHead(413, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Payload too large' }));
                return;
            }

            try {
                const parsedBody = JSON.parse(body);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(parsedBody));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });

        return;
    }

    // GET /time?tz=Africa/Accra
    if (req.method === 'GET' && url.pathname === '/time') {
        const timezone = url.searchParams.get('tz');

        try {
            if (!timezone) {
                throw new Error('Timezone is required');
            }

            const time = new Intl.DateTimeFormat('en-GB', {
                timeZone: timezone,
                dateStyle: 'full',
                timeStyle: 'long'
            }).format(new Date());

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                timezone,
                time
            }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid or missing timezone' }));
        }

        return;
    }

    // 404 for everything else
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

setupShutdown(server);

