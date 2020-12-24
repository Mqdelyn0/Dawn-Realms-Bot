const Discord = require('discord.js');
const config = require('../config.json');
const permission = require('../library/perrmission_check.js');
const logger = require('../library/logger.js');
const errors = require('../library/errors.js');
const LinkingModel = require('../database_models/linking.js');

module.exports = {
    run: async(client, message, arguments) => {
        if(arguments.length === 0) {
            let message_embed = new Discord.MessageEmbed()
                .setTitle(`**Help Menu** (Account Lining)`)
                .setDescription(`-linking (Code)\n-linking unlink\n-linking info`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            return message.channel.send(message_embed);
        } else if(arguments.length !== 0) {
            if(arguments[0] !== "unlink" || arguments[0] !== "info") {
                let linking_model = await LinkingModel.findOne({ linking_code: arguments[0] });
                if(linking_model) {
                    if(linking_model.linking_needs_confirmation === true || linking_model.is_linked === true) {
                        let message_embed = new Discord.MessageEmbed()
                            .setTitle(`**Error** (Account Lining)`)
                            .setDescription(`Your account needs confirmation or is already linked! If you're linking, Do \`/link confirm\` ingame to finish!`)
                            .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                            .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                        return message.channel.send(message_embed);
                    } else if(linking_model.linking_needs_confirmation === false) {
                        LinkingModel.updateOne({ linking_code: arguments[0] }, { linking_needs_confirmation: true, discord_tag: message.author.tag, discord_id: message.author.id}, (error) => {
                            if(error) {
                                return logger.error(`There was a error updating a Linking model for ${message.author.tag}!\n\nError: ${error}`);
                            } else if(!error) {
                                let message_embed = new Discord.MessageEmbed()
                                    .setTitle(`**Account Lining** (Confirmation)`)
                                    .setDescription(`Please do \`/link confirm\` ingame to finish! You have 5 minutes to do this.`)
                                    .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                                    .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                                return message.channel.send(message_embed);
                            }
                        });
                    } 
                } else if(!linking_model) {
                    let message_embed = new Discord.MessageEmbed()
                        .setTitle(`**Error** (Account Lining)`)
                        .setDescription(`That isn't a valid command / code!`)
                        .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                        .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
                    return message.channel.send(message_embed);
                }
            } else if(arguments[0] === "unlink" || arguments[0] === "info") {
                if(arguments[0] === "unlink") {
                    
                }
            }
        }
    },

    name: "linking",
    aliases: ["link"],
    category: "Server",
    information: "Link your Minecraft & Discord account.."
}