const Discord = require('discord.js');
const logger = require('../../library/logger.js');
const config = require('../../config.json');
const errors = require('../../library/errors.js');
const ReactionRoleModel = require('../../database_models/reaction_roles.js');

module.exports = async(client, reaction, user) => {
    if(!reaction.message.channel.id === config.CHANNELS.REACTION_ROLES) return;
    let guild = client.guilds.cache.get(config.BOT_SETTINGS.GUILD_ID);
    let member = guild.members.cache.get(user.id);
    let reaction_role_model = await ReactionRoleModel.findOne({ message_id: reaction.message.id });
    
    if(reaction_role_model) {
        let role = guild.roles.cache.get(reaction_role_model.role_id);
        if(member.roles.cache.has(role.id)) {
            member.roles.remove(role);
            let message_embed = new Discord.MessageEmbed()
                .setTitle(`**Reaction Roles** | Removed`)
                .setDescription(`Removed ${role.name} from you!`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            member.send(message_embed).catch(error => {
                return errors.cant_dm(client, member);
            });
            logger.info(`Removed ${role.name} from ${member.user.tag}!`);
        } else if(!member.roles.cache.has(role.id)) {
            member.roles.add(role);
            let message_embed = new Discord.MessageEmbed()
                .setTitle(`**Reaction Roles** | Added`)
                .setDescription(`Added ${role.name} to you!`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            member.send(message_embed).catch(error => {
                return errors.cant_dm(client, member);
            });
            logger.info(`Added ${role.name} to ${member.user.tag}!`);
        } 
    }
}