const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    run: async(client, message, arguments) => {
        const commands = client.commands;
        if(arguments.length === 0) {
            let categories = [];
            commands.forEach(command => {
                let category = command.category;
                if (!categories.includes(category)) {
                    categories.push(category);
                }
            });
            let message_embed = new Discord.MessageEmbed()
                .setTitle("**Help Menu** (Categories)")
                .setDescription(`Here's a list of all my categories! Do \`-help (Category)\`\n\n${categories.join('\n')}\n`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            message.channel.send(message_embed);
        } else if (arguments.length !== 0) {
            let category = arguments[0];
            let commands_list = [];
            commands.forEach(command => {
                let combined_command = `-${command.name} | *${command.information}*`;
                if(!commands_list.includes(combined_command) && category === command.category) {
                    commands_list.push(combined_command);
                }
            });
            let message_embed = new Discord.MessageEmbed()
                .setTitle(`**Help Menu** (${category})`)
                .setDescription(`Here's a list of ${category} commands!\n\n${commands_list.join('\n')}\n`)
                .setColor(config.BOT_SETTINGS.EMBED_COLOR)
                .setFooter(config.BOT_SETTINGS.EMBED_AUTHOR);
            message.channel.send(message_embed);
            }
    },

    name: "help",
    aliases: ["comamnds", "bot", "bothelp"],
    category: "Important",
    information: "Opens this Help Menu."
}