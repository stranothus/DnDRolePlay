/**
 * Sends a message as a user through a webhook
 * 
 * @typedef {import("discord.js")} TextChannel
 * 
 * @param {TextChannel} channel - the channel to message
 * @param {object} user - the user object to send the message as
 * @param {string} content - the content to send
 * 
 * @returns {void}
 */
 async function asUser(channel, user, content) {
    if(channel.type === "GUILD_PUBLIC_THREAD" || channel.type === "GUILD_PRIVATE_THREAD") {
        let webhook = (await channel.parent.fetchWebhooks()).filter(webhook => webhook.name === "DnDRolePlay").first() || await channel.parent.createWebhook("DnDRolePlay");

        webhook.send({
            ...content,
            "avatarURL": user.avatar,
            "username": user.name,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            },
            "threadId": channel.id
        });
    } else {
        let webhook = (await channel.fetchWebhooks()).filter(webhook => webhook.name === "DnDRolePlay").first() || await channel.createWebhook("DnDRolePlay");

        webhook.send({
            ...content,
            "avatarURL": user.avatar,
            "username": user.name,
            "allowedMentions": {
                "roles": [],
                "users": [],
                "parse": []
            }
        });
    }
}

export default asUser;