import { Hono } from 'hono';
import { cors } from 'hono/cors';

export const corsMiddleware = (app: Hono) => {
  app.use(
    '*',
    cors({
      origin: ['http://localhost:8080'],
      allowMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Allowed HTTP methods
      credentials: false, // If you need cookies or credentials
      maxAge: 600,
    }),
  );
};
