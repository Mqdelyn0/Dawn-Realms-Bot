const log4js = require('log4js');
const config = require('../config.json');
log4js.configure({
    appenders: {
        console: {
            type: 'stdout',
            layout: {
                type: 'pattern', pattern: '[%d / %p] %m'
            }
        },
        file: {
            type: 'file',
            filename: "./logs/main.log",
            layout: {
                type: 'pattern', pattern: '[%d / %p] %m'
            }
        }
    },
    categories: {
        default: { 
            appenders: ['console', 'file'], 
            level: 'info', 
            enableCallStack: true 
        }
    }
});

const logger = log4js.getLogger('thing');

module.exports = {
    info: async(message) => {
        logger.info(message);
    },
    warn: async(message) => {
        logger.warn(message); 
    },
    error: async(message) => {
        logger.error(message) 
    }
}