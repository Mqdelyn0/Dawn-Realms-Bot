const Discord = require('discord.js');
const logger = require('../../library/logger.js');
const config = require('../../config.json');

module.exports = async(client, member) => {
    let message_channel = client.channels.cache.get(config.CHANNELS.WELCOME_LEAVE);
    let guild = client.guilds.cache.get(config.BOT_SETTINGS.GUILD_ID);
    let message_embed = new Discord.MessageEmbed()
        .setTitle(`**JOIN** [${guild.members.cache.filter(member => !member.user.bot).size}]`)
        .setDescription(`Welcome <@${member.id}> to ${guild.name}! Please read <#${config.CHANNELS.INFORMATION}> for information about ${guild.name}, And questions that you might have!`)
        .setColor(config.BOT_SETTINGS.EMBED_COLOR)
        .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
    message_channel.send(message_embed);
    member.roles.add(config.ROLES.JOIN_RANK);
    logger.info(`${member.user.tag} joined ${guild.name}! There are ${guild.memberCount} members now.`)
    client.channels.cache.get(config.CHANNELS.SERVERSTATS_ALL).setName(`All Members: ${guild.memberCount}`);
    client.channels.cache.get(config.CHANNELS.SERVERSTATS_HUMANS).setName(`Humans: ${guild.members.cache.filter(member => !member.user.bot).size}`);
    client.channels.cache.get(config.CHANNELS.SERVERSTATS_ROBOTS).setName(`Robots: ${guild.members.cache.filter(member => member.user.bot).size}`);
}