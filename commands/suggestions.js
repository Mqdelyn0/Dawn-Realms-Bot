const Discord = require('discord.js');
const config = require('../config.json');
const permission = require('../library/perrmission_check.js');
const logger = require('../library/logger.js');
const errors = require('../library/errors.js');
const SuggestionModel = require('../database_models/suggestions.js');

module.exports = {
    run: async(client, message, arguments) => {
        if(arguments.length === 0) {
            let message_embed = new Discord.MessageEmbed()
                .setTitle(`**Help Menu** (Suggestions)`)
                .setDescription(`-suggestions accept (Message ID) (Reason)\n-suggestions deny (Message ID) (Reason)`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            return message.channel.send(message_embed);
        } else if (arguments.length !== 0) {
            if(permission.has_mod(client, message.author.id) === false) {
                let message_embed = new Discord.MessageEmbed()
                    .setTitle(`**Error** (Suggestions)`)
                    .setDescription(config.MESSAGES.NO_PERMISSION)
                    .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                    .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                return message.channel.send(message_embed);
            }
            let suggestion_model = await SuggestionModel.findOne({ message_id: arguments[1] });
            if(suggestion_model) {
                let result = "NULL";
                let reason = arguments.slice(2).join(' ');
                let author = client.users.cache.get(suggestion_model.author_id);
                let channel;
                if(!reason) reason = "No Reason";
                if(arguments[0] === "accept") { 
                    result = "Accepted";
                    channel = client.channels.cache.get(config.CHANNELS.SUGGESTIONS_ACCEPT);
                } else if(arguments[0] === "deny") { 
                    result = "Denied";
                    channel = client.channels.cache.get(config.CHANNELS.SUGGESTIONS_DENIED);
                }
                let message_embed = new Discord.MessageEmbed()
                    .setTitle(`**${result} Suggestion** | ${author.tag}`)
                    .setDescription(`**SUGGESTION**\n${suggestion_model.suggestion}\n\n**REASON**\n${reason}`)
                    .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                    .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                channel.send(message_embed);
                suggestion_model.deleteOne({ message_id: arguments[1] }, (error) => {
                    if(error) {
                        logger.error(`There was a error deleting suggestion ${arguments[1]} from MongoDB!\n\n${error}`);
                    } else {
                        logger.info(`Deleted suggestion ${arguments[1]} from MongoDB!`);
                        let message_embed = new Discord.MessageEmbed()
                            .setTitle("**Suggestion Deletion**")
                            .setDescription(`Your suggestion (${suggestion_model.message_id}) was ${result}!\nReason: ${reason}`)
                            .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                            .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                        author.send(message_embed).catch(error => {
                            errors.cant_dm(client, author);
                        });
                    }
                });
            } else {
                let message_embed = new Discord.MessageEmbed()
                    .setTitle(`**Error** (Suggestions)`)
                    .setDescription(`That isn't a suggestion!`)
                    .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                    .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                return message.channel.send(message_embed);
            }
        }
    },

    name: "suggestions",
    aliases: ["suggest"],
    category: "Server",
    information: "Manage Suggestions."
}