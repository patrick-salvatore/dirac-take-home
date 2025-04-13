process.on('uncaughtException', (e) => {
  console.log(
    `uncaughtException (${process.env.SERVICE_NAME || 'unknown'})`,
    e.message,
    e.stack,
  );
  process.exit(1);
});

import { logger } from './logger';
import App from './app';

const app = new App();
import dotenv from 'dotenv';

dotenv.config();

app
  .initialize()
  .then(() => app.listen())
  .catch((e) => {
    logger.error(e.stack);
  });
