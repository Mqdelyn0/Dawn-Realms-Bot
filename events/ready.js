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
        let role;
        let linking_roles = config.ROLES.LINKING;
        let linking_model = await LinkingModel.findOne({ discord_id: member.id });
        if(linking_model) {
            if(linking_model.is_verified === false) return;
            linking_roles.forEach(role_id => {
                let role = guild.roles.cache.get(role_id);
                if(member.roles.cache.has(role.id)) {
                    if(linking_model.player_rank !== role.name) {
                        logger.info(`Removed ${role.name} from ${member.user.tag}!`);
                        member.roles.remove(role);
                    } else if(linking_model.player_rank === role.name) {
                        member.setNickname(`${linking_model.player_name}`);
                    }
                }
            });
            let role_linked = guild.roles.cache.get(config.ROLES.LINKED);
            if(!member.roles.cache.has(role_linked.id)) {
                member.roles.add(role_linked);
                logger.info(`Added ${role_linked.name} to ${member.user.tag} as they linked their account!`);
            }
            let role_needed = guild.roles.cache.filter(check_role => check_role.name === linking_model.player_rank).first();
            let role_player = guild.roles.cache.get(role_needed.id);
            if(!member.roles.cache.has(role_player.id)) {
                member.roles.add(role_player);
                logger.info(`Added ${role_player.name} to ${member.user.tag} as they linked their account!`);
            }
        } else {
        /*
            let role = guild.roles.cache.get(config.ROLES.LINKED);
            if(member.roles.cache.has(role.id)) {
                member.roles.remove(role);
                logger.info(`Removed ${role.name} from ${member.user.tag} as they unlinked their account!`);
            }

            linking_roles.forEach(role_id => {
                let role = guild.roles.cache.get(role_id);
                if(member.roles.cache.has(role.id)) {
                    logger.info(`Removed ${role.name} from ${member.user.tag} as they unlinked their account!`);
                    member.roles.remove(role);
                }
            }); 
        */
        }
    });
}