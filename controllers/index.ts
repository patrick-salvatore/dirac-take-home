import { Hono } from 'hono';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { recurseDir } from '../helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function initialize(app: Hono) {
  return recurseDir(
    __dirname,
    (file = '') => file.includes('_controller'),
    (file = '') => import(file).then((module) => module.initialize(app)),
  );
}
