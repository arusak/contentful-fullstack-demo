// const winston = require('winston')
//
// const logger = winston.createLogger({
//   level: 'error',
//   format: winston.format.json(),
//   transports: [new winston.transports.Console()],
// })
//
// function errorHandler(err, req, res, next) {
//   if (err.name === 'NotFound') {
//     logger.error('Not found error', { error: err.message })
//     return res.status(404).json({ error: 'Not found' })
//   }
//   if (err.sys && err.sys.id === 'RateLimitExceeded') {
//     logger.error('Rate limit exceeded', { error: err.message })
//     return res.status(429).json({ error: 'Rate limit exceeded' })
//   }
//   logger.error('Internal server error', { error: err.message })
//   res.status(500).json({ error: 'Internal server error' })
// }
//
// module.exports = errorHandler
