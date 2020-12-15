const mongoose = require('mongoose');

const ReactionRoles = mongoose.Schema({ 
    role_id: String,
    message_id: String,
});

module.exports = mongoose.model('ReactionRoles', ReactionRoles);