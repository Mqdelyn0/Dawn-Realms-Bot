const mongoose = require('mongoose');

const Linking = mongoose.Schema({ 
    player_uuid: String,
    linking_code: String,
    player_name: String,
    player_rank: String,
    discord_tag: String,
    discord_id: String,
    linking_needs_confirmation: Boolean,
    is_linked: Boolean
});

module.exports = mongoose.model('Linking', Linking);