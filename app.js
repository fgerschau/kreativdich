const log4js = require('log4js');
const logger = log4js.getLogger();
require('./config/log')();

const config = require('./config/config');

let localConfig = {};
try {
  localConfig = require('./config/config.local.json');
} catch (e) {
  logger.warn("Local 'config.local.json' file is missing.");
}

const env = localConfig.ENV || 'DEV';

const app = require('./config/express')(env);

require('./config/prismic/prismic-middleware')(app);
require('./config/routes')(app);

const PORT = config.port;

app.listen(PORT, () => {
  logger.info('#################################');
  logger.info(`# Server started at port ${PORT}  #`);
  logger.info('#################################');
  logger.info(`Environment = ${env}`);
});
