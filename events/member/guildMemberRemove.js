const Discord = require('discord.js');
const logger = require('../../library/logger.js');
const config = require('../../config.json');
const LinkingModel = require('../../database_models/linking.js');

module.exports = async(client, member) => {
    let message_channel = client.channels.cache.get(config.CHANNELS.WELCOME_LEAVE);
    let guild = client.guilds.cache.get(config.BOT_SETTINGS.GUILD_ID);
    let message_embed = new Discord.MessageEmbed()
        .setTitle(`**LEAVE** [${guild.members.cache.filter(member => !member.user.bot).size}]`)
        .setDescription(`Hope to see ${member.user.tag} in the future :(`)
        .setColor(config.BOT_SETTINGS.EMBED_COLOR)
        .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
    message_channel.send(message_embed);
    logger.info(`${member.user.tag} left ${guild.name}! There are ${guild.memberCount} members left.`)
    client.channels.cache.get(config.CHANNELS.SERVERSTATS_ALL).setName(`All Members: ${guild.memberCount}`);
    client.channels.cache.get(config.CHANNELS.SERVERSTATS_HUMANS).setName(`Humans: ${guild.members.cache.filter(member => !member.user.bot).size}`);
    client.channels.cache.get(config.CHANNELS.SERVERSTATS_ROBOTS).setName(`Robots: ${guild.members.cache.filter(member => member.user.bot).size}`);
    LinkingModel.deleteOne({ discord_id: member.user.id}, (error) => {
        if(error) {
            logger.error(`There was a error deleting ${member.user.id}'s linking from MongoDB!\n\n${error}`);
        }
    });
}