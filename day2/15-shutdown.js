function setupShutdown(server) {
    function shutdown() {
        console.log('shutting down');

        const timeout = setTimeout(() => {
            console.error('Could not close server in time');
            process.exit(1);
        }, 10000);

        server.close(() => {
            clearTimeout(timeout);
            process.exit(0);
        });
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

module.exports = setupShutdown;