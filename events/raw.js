module.exports = async(client, packet) => {
    if(packet.t === "MESSAGE_REACTION_ADD" || packet.t === "MESSAGE_REACTION_REMOVE") {
        const channel = client.channels.cache.get(packet.d.channel_id);
        if(channel.messages.cache.has(packet.d.message_id)) return;

        channel.messages.fetch(packet.d.message_id).then(message => {
            const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
            const reaction = message.reactions.cache.get(emoji);
            const user = client.users.cache.get(packet.d.user_id);
            if(packet.t === "MESSAGE_REACTION_ADD") return client.emit(`messageReactionAdd`, reaction, user);
            if(packet.t === "MESSAGE_REACTION_REMOVE") return client.emit(`messageReactionRemove`, reaction, user);
        });
    }
}