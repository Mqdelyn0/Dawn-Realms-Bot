const Discord = require('discord.js');
const config = require('../config.json');
const permission = require('../library/perrmission_check.js');
const ReactionRoleModel = require('../database_models/reaction_roles.js');
const logger = require('../library/logger');

module.exports = {
    run: async(client, message, arguments) => {
        if(arguments.length === 0) {
            let message_embed = new Discord.MessageEmbed()
                .setTitle(`**Help Menu** (Reaction Roles)`)
                .setDescription(`-reactionrole create (Role ID) (Description)\n-reactionrole delete (Message ID)`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            return message.channel.send(message_embed);
        } else if(arguments.length !== 0) {
            if(permission.has_admin(client, message.author.id) === false) {
                let message_embed = new Discord.MessageEmbed()
                    .setTitle(`**Error** (Reaction Roles)`)
                    .setDescription(config.MESSAGES.NO_PERMISSION)
                    .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                    .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                return message.channel.send(message_embed);
            }
            if(arguments.length <= 2) {
                let message_embed = new Discord.MessageEmbed()
                    .setTitle(`**Reaction Roles** (Error)`)
                    .setDescription(`Incorrect Usage!\n**EXAMPLE USAGE** -reactionrole create 772973727159549953 Get the Community Role.`)
                    .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                    .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                return message.channel.send(message_embed);
            }
            let description = arguments.slice(2).join(' ');
            let channel = client.channels.cache.get(config.CHANNELS.REACTION_ROLES);
            let guild = client.guilds.cache.get(config.BOT_SETTINGS.GUILD_ID);
            let role = guild.roles.cache.get(arguments[1])
            let message_embed = new Discord.MessageEmbed()
                .setTitle(`**Reaction Role** | ${role.name}`)
                .setDescription(`${description}`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            channel.send(message_embed).then(reaction_role => {
                reaction_role.react('👍');
                let reaction_role_model = new ReactionRoleModel({
                    role_id: role.id,
                    message_id: reaction_role.id
                });
                try {
                    reaction_role_model.save();
                    logger.info(`Saved reaction role ${role.name} with message ${reaction_role.id}!`);
                    let message_embed = new Discord.MessageEmbed()
                        .setTitle(`**Reaction Role Creation**`)
                        .setDescription(`You created a reaction role for ${role.name}! The message ID is ${reaction_role.id}`)
                        .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                        .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                    message.channel.send(message_embed);
                } catch(error) {
                    logger.error(`Couldn't make a reaction role for ${role.name}!\n\n${error}`);
                    reaction_role.delete();
                }
            });
        }
    },

    name: "reactionrole",
    aliases: ["rrole", "reactrole"],
    category: "Server",
    information: "Manage the Reaction Roles."
}