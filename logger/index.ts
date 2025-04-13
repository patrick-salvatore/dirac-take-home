import * as bunyan from 'bunyan';

const streams = [
  { level: Number(process.env.logger) || 1, stream: process.stdout },
];

const name = process.env.SERVICE_NAME || 'unknown';

const serializers = bunyan.stdSerializers;

const logger = bunyan.createLogger({
  name,
  streams,
  serializers,
});

logger.info({ name }, 'logger init');

export { logger, streams, logger as default };
