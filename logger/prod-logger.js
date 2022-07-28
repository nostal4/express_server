const { format, createLogger, transports, level } = require('winston');
const { timestamp, combine, errors, json } = format;

function buildProdLogger() {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'user-service' },
    transports: [new transports.File({
      level: 'error',     
      filename: 'logs/error.log'
  }),
  new transports.File({
      level: 'info',     
      filename: 'logs/info.log'
  }),
  new transports.Console({level: 'error'})],
  });
}

module.exports = buildProdLogger;