const mongoose = require("mongoose");
const logger = require("./logger.js");
const config = require("../config.json");

module.exports = {
    init: (client) => {
        const database_options = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            poolSize: 5,
            connectTimeoutMS: 5000,
            family: 4
        };
        mongoose.connect(config.BOT_SETTINGS.MONGODB_URL, database_options);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => {
            logger.info('Successfully logged into MongoDB!');
        });
        mongoose.connection.on('err', (error) => {
            logger.error(`There was a error with MongoDB:\n${error}`);
        });
        mongoose.connection.on('disconnected', () => {
            logger.warn(`Disconnected from MongoDB!`);
        });
    }
}