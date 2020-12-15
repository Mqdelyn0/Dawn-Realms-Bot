const Discord = require('discord.js');
let config = require('../config.json');
let logger = require('./logger.js');
let mod_roles = config.PERMISSIONS.MODERATOR;
let admin_roles = config.PERMISSIONS.ADMINISTRATOR;

module.exports = {
    cant_dm: (client, user) => {
        let channel = client.channels.cache.get(config.CHANNELS.BOT_COMMANDS);
        let message_embed = new Discord.MessageEmbed()
            .setTitle(`**Messages** (Error)`)
            .setDescription(`I couldn't message you, <@${user.id}>. Please turn on your messages!`)
            .setColor(config.BOT_SETTINGS.EMBED_COLOR)
            .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
        channel.send(message_embed);
        logger.warn(`I couldn't message ${user.tag}!`);
        channel.send(`<@${user.id}>`).then(message => {
            setTimeout(function(){
                message.delete();
            }, 5000);
        });
    }
}