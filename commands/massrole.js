const Discord = require('discord.js');
const config = require('../config.json');
const permission = require('../library/perrmission_check');

module.exports = {
    run: async(client, message, arguments) => {
        let guild = client.guilds.cache.get(config.BOT_SETTINGS.GUILD_ID);
        if(!permission.has_admin(client, message.author.id)) {
            let message_embed = new Discord.MessageEmbed()
                .setTitle(`**ERROR** (Massrole)`)
                .setDescription(`you dont have a permission to do this moron`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            return message.channel.send(message_embed);
        }
        if(arguments.length === 0) {
            let message_embed = new Discord.MessageEmbed()
                .setTitle(`**Help Menu** (Massrole)`)
                .setDescription(`-massrole add (Role ID)\n-massrole remove (Role ID)`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            return message.channel.send(message_embed);
        } else if(arguments.length >= 1) {
            if(arguments[0] !== "add" && arguments[0] !== "remove") {
                let message_embed = new Discord.MessageEmbed()
                    .setTitle(`**Help Menu** (Massrole)`)
                    .setDescription(`-massrole add (Role ID)\n-massrole remove (Role ID)`)
                    .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                    .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                return message.channel.send(message_embed);
            } else if(arguments[0] === "add") {
                if(arguments[1] === null) {
                    return message.channel.send(`__**ERROR**__ Not enough arguments!\n**EXAMPLE** \`-massrole add 772973727159549953\``);
                } else if(arguments[1] !== null) {
                    let role = guild.roles.cache.get(arguments[1]);
                    if(!role) return;
                    message.channel.send(`__**MASSROLE**__ Starting to give everyone the ${role.name} Role!`);
                    setTimeout(async() => {
                        let count = 0;
                        let err_count = 0;
                        guild.members.cache.forEach(async(member) => {
                            if(!member.roles.cache.has(role)) {
                                member.roles.add(role).catch(error => {
                                    err_count++;
                                    count--;
                                });
                                count++;
                            }
                        });
                        let message_embed = new Discord.MessageEmbed()
                            .setTitle(`__**MASSROLE COMPLETION**__`)
                            .setDescription(`**SUCCESS** ${count}\n**FAILED** ${err_count}\n**MEMBERS** ${guild.memberCount}`)
                            .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                            .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                        return message.channel.send(message_embed);
                    })
                }
            }
        }
    },

    name: "massrole",
    aliases: ["mrole", "massr"],
    category: "Important",
    information: "Manage everyone's roles."
}