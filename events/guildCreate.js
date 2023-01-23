import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dirFlat from "../utils/dirFlat.js";

export default {
    type: "on",
    name: "guildCreate",
    execute: guild => {

        // load commands
        Promise.all(dirFlat("./commands").map(async v => {
            let imported = await import("../" + v);
        
            return {
                command: v.replace(/\.[^\.]+$/, ""),
                file: v,
                ...imported.default
            };
        })).then(async commands => {
            const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

            // register slash commands in new server
            try {
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guild.id), {
                        body: commands.map(v => v.data.toJSON())
                    }
                );
            } catch (error) {
                console.error(error);
            }

            await global.DB.db("Info").collection("Guilds").insertOne({
                guildID: guild.id,
                channels: []
            });
        });
    }
}