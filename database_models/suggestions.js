const mongoose = require('mongoose');

const Suggestion = mongoose.Schema({
    message_id: String,
    suggestion: String,
    author_id: String
});

module.exports = mongoose.model('Suggestion', Suggestion);