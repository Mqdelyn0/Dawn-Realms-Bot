const Discord = require('discord.js');
const logger = require('../../library/logger.js');
const errors = require('../../library/errors.js');
const config = require('../../config.json');
const SuggestionModel = require('../../database_models/suggestions.js');

module.exports = async(client, message) => {
    if(message.author.bot) return;
    if(message.channel.id !== config.CHANNELS.SUGGESTIONS_CREATE) return;

    let message_embed = new Discord.MessageEmbed()
        .setTitle(`**Suggestion** | ${message.author.tag}`)
        .setDescription(`${message.content}`)
        .setColor(config.BOT_SETTINGS.EMBED_COLOR)
        .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
    message.delete();
    message.channel.send(message_embed).then(suggestion => {
        suggestion.react('👍');
        suggestion.react('👎');
        let suggestion_model = new SuggestionModel({
            message_id: suggestion.id,
            suggestion: message.content,
            author_id: message.author.id
        });
        try {
            suggestion_model.save();
            logger.info(`Created suggestion ${suggestion.id} made by ${message.author.id}!\nSuggestion: ${message.content}`);
            let message_embed = new Discord.MessageEmbed()
                .setTitle("**Suggestion Creation**")
                .setDescription(`You successfully created a suggestion! (${suggestion.id})\nSuggestion: ${message.content}`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            message.author.send(message_embed).catch(error => {
                errors.cant_dm(client, message.author);
            });
        } catch(error) {
            logger.error(`There was a error whilst creating a suggestion for ${message.author.id}!\nSuggestion: ${message.content}\n\n${error}`);
            suggestion.delete();
        }
    });
}