import { Permissions } from "discord.js"

export default {
    type: "on",
    name: "guildMemberUpdate",
    execute: async (old, current) => {
        let setup = (await client.guilds.cache.get(current.guild.id).commands.fetch()).filter(v => v.name === "setup")[0];

        if(current.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            let permission = [
                {
                    id: current.user.id,
                    type: "USER",
                    permission: true
                }
            ];

            setup.permissions.add({ permission });
        } else if(old.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            let permission = [
                {
                    id: current.user.id,
                    type: "USER",
                    permission: false
                }
            ];

            setup.permissions.add({ permission });
        }
    }
}