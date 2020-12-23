const Discord = require('discord.js');
const config = require('../config.json');
const permission = require('../library/perrmission_check.js');
const logger = require('../library/logger.js');
const errors = require('../library/errors.js');
const LinkingModel = require('../database_models/linking.js');

module.exports = {
    run: async(client, message, arguments) => {

    },

    name: "ticket",
    aliases: [],
    category: "Server",
    information: "Manage Tickets."
}