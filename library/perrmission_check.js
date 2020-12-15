let config = require('../config.json');
let mod_roles = config.PERMISSIONS.MODERATOR;
let admin_roles = config.PERMISSIONS.ADMINISTRATOR;

module.exports = {
    has_mod: (client, member_id) => {
        const guild = client.guilds.cache.get(config.BOT_SETTINGS.GUILD_ID);
        const member = guild.members.cache.get(member_id);
        if(member.roles.cache.some(role => mod_roles.includes(role.id))) {
            return true;
        } else {
            return false;
        }
    },

    has_admin: (client, member_id) => {
        const guild = client.guilds.cache.get(config.BOT_SETTINGS.GUILD_ID);
        const member = guild.members.cache.get(member_id);
        if(member.roles.cache.some(role => admin_roles.includes(role.id))) {
            return true;
        } else {
            return false;
        }
    }
}