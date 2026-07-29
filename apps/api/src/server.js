import { createServer } from 'node:http';
import { createApp } from './app.js';
import { config } from './config.js';

const server = createServer(createApp());

server.listen(config.PORT, '0.0.0.0', () => {
  console.log(`VHA API listening on http://0.0.0.0:${config.PORT}`);
});

function shutdown(signal) {
  console.log(`${signal} received, closing server.`);
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
