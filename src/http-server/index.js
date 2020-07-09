import Koa from 'koa';
import http from 'http';
import Boom from 'boom';
import pino from 'koa-pino-logger';
import bodyParser from 'koa-bodyparser';
import errorHandler from './middleware/errorHandler';
import health from './health';
import api from './api';

export default function createServer() {
  const app = new Koa();

  // setup logging
  app.use(pino());

  // handle errors
  app.use(errorHandler);

  // parse application/json
  app.use(
    bodyParser({
      enableTypes: ['json'],
      onerror: (err) => {
        throw Boom.badRequest(err);
      },
    })
  );

  // register routes
  app.use(health.routes(), health.allowedMethods());
  app.use(
    api.routes(),
    api.allowedMethods({
      throw: true,
      notImplemented: () => Boom.notImplemented(),
      methodNotAllowed: () => Boom.methodNotAllowed(),
    })
  );

  return http.createServer(app.callback());
}
