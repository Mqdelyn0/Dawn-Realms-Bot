const logger = require('../library/logger.js');
const config = require('../config.json');

module.exports = async(client) => {
    let guild = client.guilds.cache.get(config.BOT_SETTINGS.GUILD_ID);
    logger.info(`${client.user.tag} logged in! Watching ${guild.members.cache.filter(member => !member.user.bot).size} people!`);
}