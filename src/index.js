import 'dotenv/config';

import logger from 'logger';
import createHttpServer from './http-server';

const NODE_ENV = process.env.NODE_ENV || 'development';

async function terminate() {
  process.exit(1);
}

logger.info('Launching service in %s mode...', NODE_ENV);

// HTTP server
const port = process.env.HTTP_PORT || 3000;
const server = createHttpServer();
server.listen(port);
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      logger.error(`Port ${port} requires elevated privileges`);
      terminate();
      break;
    case 'EADDRINUSE':
      logger.error(`Port ${port} is already in use`);
      terminate();
      break;
    default:
      throw error;
  }
});
server.on('listening', () => {
  logger.info(`HTTP server listening at http://127.0.0.1:${port}`);
});

// Process termination
['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach((signal) => {
  process.once(signal, () => {
    logger.error('Received %s - terminating process...', signal);
    terminate();
  });
});

process.on('exit', () => logger.info('Process terminated'));
