import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';

export function initialize(app: Hono) {
  app.use(
    '/public/*',
    serveStatic({
      root: '/',
      onNotFound: (path, c) => {
        console.log(`${path} is not found, you access ${c.req.path}`);
      },
    }),
  );
  app.get(
    '*',
    serveStatic({
      path: 'public/index.html',
    }),
  );
}
