import { Permissions } from "discord.js"

export default {
    type: "on",
    name: "guildMemberAdd",
    execute: async member => {
        let setup = (await client.guilds.cache.get(member.guild.id).commands.fetch()).filter(v => v.name === "setup")[0];

        if(member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            let permission = [
                {
                    id: member.user.id,
                    type: "USER",
                    permission: true
                }
            ];

            setup.permissions.add({ permission });
        } else {
            let permission = [
                {
                    id: member.user.id,
                    type: "USER",
                    permission: false
                }
            ];

            setup.permissions.add({ permission });
        }
    }
}