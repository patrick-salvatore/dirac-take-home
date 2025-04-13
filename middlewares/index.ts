import { Hono } from 'hono';

import { corsMiddleware } from './cors';

export async function initialize(app: Hono) {
  corsMiddleware(app);
}
