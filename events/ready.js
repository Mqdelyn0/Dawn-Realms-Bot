const logger = require('../library/logger.js');
const config = require('../config.json');
const LinkingModel = require('../database_models/linking.js');

module.exports = async(client) => {
    let guild = client.guilds.cache.get(config.BOT_SETTINGS.GUILD_ID);
    logger.info(`${client.user.tag} logged in! Watching ${guild.members.cache.filter(member => !member.user.bot).size} people!`);
    refreshLinking(client, guild);
    setInterval(() => {
        refreshLinking(client, guild);
    }, 1000 * 300);
}

function refreshLinking(client, guild) {
    guild.members.cache.forEach(async(member) => {
        let linking_roles = config.ROLES.LINKING;
        let linking_model = await LinkingModel.findOne({ discord_id: member.id });
        if(linking_model) {
            member.setNickname(`${linking_model.player_name} | ${linking_model.player_rank}`);
            if(linking_model.is_verified === false) return;
            linking_roles.forEach(role_id => {
                let role = guild.roles.cache.get(role_id);
                if(member.roles.cache.has(role.id)) {
                    if(linking_model.player_rank !== role.name) {
                        logger.info(`Removed ${role.name} from ${member.user.tag}!`);
                        member.roles.remove(role);
                    }
                }
            });
            let role_needed;
            let role_linked = guild.roles.cache.filter(check_role => check_role.id ===config.ROLES.LINKED).first();
            if(!member.roles.cache.has(role_linked)) {
                member.roles.add(role_linked);
                logger.info(`Added ${role_linked.name} to ${member.user.tag} as they linked their account!`);
            }
            role_needed = guild.roles.cache.filter(check_role => check_role.name === linking_model.player_rank).first();
            if(!role_needed) role_needed = guild.roles.cache.filter(check_role => check_role.name === "No Rank").first()
            if(!member.roles.cache.has(role_needed)) {
                member.roles.add(role_needed);
                logger.info(`Added ${role_needed.name} to ${member.user.tag} as they linked their account!`);
            }
        } else if(!linking_model) {
            let role = guild.roles.cache.get(config.ROLES.LINKED);
            if(member.roles.cache.has(role.id)) {
                member.roles.remove(role);
                logger.info(`Removed ${role.name} from ${member.user.tag} as they unlinked their account!`);
            }

            linking_roles.forEach(role_id => {
                let role = guild.roles.cache.get(role_id);
                if(member.roles.cache.has(role)) {
                    logger.info(`Removed ${role.name} from ${member.user.tag} as they unlinked their account!`);
                    member.roles.remove(role);
                }
            }); 
        }
    });
}