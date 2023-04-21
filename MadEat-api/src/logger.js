
import log4js from "log4js";
import config from './config.js';

let logger = log4js.getLogger();
logger.level = config.logger.level;

export default logger;
