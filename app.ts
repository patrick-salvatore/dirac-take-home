import { Hono } from 'hono';
import { serve, type ServerType } from '@hono/node-server';
import * as controllers from './controllers';
import * as middleware from './middlewares';
import { logger } from './logger';

class App {
  _server: Hono;
  httpServer: ServerType | undefined;

  SIGNALS = ['SIGTERM', 'SIGINIT'];

  constructor() {
    this._server = new Hono();
  }

  exitError(e1: Error) {
    return (e2: Error) => {
      logger.error(e1, e2);
      process.exit(1);
    };
  }

  gracefulExit(signal: string, exitCode = 0) {
    return () => {
      logger.info(`graceful exit: got signal ${signal} with code ${exitCode}`);

      // do not accept any new http requests
      this.httpServer?.close();

      // set exit code for when cleanup is complete and process exits
      process.exitCode = exitCode;
    };
  }

  async initialize() {
    await middleware.initialize(this._server);
    await controllers.initialize(this._server);
  }

  listen() {
    this.SIGNALS.forEach((signal) =>
      process.on(signal, this.gracefulExit(signal)),
    );

    // Start the server
    const port = Number(process.env.PORT) || 8080;

    logger.info(`Listening on port ${port}... 🚀`);
    this.httpServer = serve({
      fetch: this._server.fetch,
      port,
    });

    return this.httpServer;
  }

  get server() {
    return this._server;
  }
}

export default App;
