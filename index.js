const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs').promises;
const path = require('path');
const logger = require("./library/logger.js");
const mongoose = require("./library/mongoose.js");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.login(config.BOT_SETTINGS.BOT_TOKEN);
mongoose.init(client);

client.on('message', async function (message) {
    if(message.author.bot) return;
    if(!message.content.startsWith(config.BOT_SETTINGS.PREFIX)) return;
    
    let command_arguments = message.content.substring(message.content.indexOf(config.BOT_SETTINGS.PREFIX) + 1).split(new RegExp(/\s+/));
    let command_name = command_arguments.shift().toLowerCase();
    logger.info(`${message.author.username} executed Dawn Realms command: ${message.content}`);

    if(client.commands.get(command_name)) client.commands.get(command_name).run(client, message, command_arguments);
    if(client.aliases.get(command_name)) client.aliases.get(command_name).run(client, message, command_arguments);
});

(async function registerCommands(directory = 'commands') {
    let files = await fs.readdir(path.join(__dirname, directory));
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, directory, file));
        if(stat.isDirectory()) {
            registerCommands(path.join(directory, file));
            logger.info(`Directory found and registering commands: ${path.join(directory, file)}`);
        } else if(file.endsWith(".js")) {
            let command_name = file.substring(0, file.indexOf(".js"));
            let command_module = require(path.join(__dirname, directory, file));
            let { aliases } = command_module;
            if(aliases.length !== 0) { 
                aliases.forEach(alias => {
                    client.aliases.set(alias, command_module);
                    logger.info(`Alias found for ${command_name} and loaded: ${alias} (${path.join(directory, file)})`);
                });
            }
            client.commands.set(command_name, command_module);
            logger.info(`Command found and loaded: ${command_name} (${path.join(directory, file)})`);
        }
    }
})();

(async function registerEvents(directory = 'events') {
    let files = await fs.readdir(path.join(__dirname, directory));
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, directory, file));
        if(stat.isDirectory()) {
            registerEvents(path.join(directory, file));
            logger.info(`Directory found and registering events: ${path.join(directory, file)}`);
        } else if(file.endsWith(".js")) {
            let event_name = file.substring(0, file.indexOf(".js"));
            let event_module = require(path.join(__dirname, directory, file));
            client.on(event_name, event_module.bind(null, client));
            logger.info(`Event found and loaded: ${event_name} (${path.join(directory, file)})`);
        }
    }
})();