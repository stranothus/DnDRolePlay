import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dirFlat from "../utils/dirFlat.js";
import discord from "discord.js";

export default {
    type: "once",
    name: "ready",
    execute: client => {
        console.log("Logged in as " + client.user.tag);

        client.commands = new discord.Collection();
        
        Promise.all(dirFlat("./commands").map(async v => {
            let imported = await import("../" + v);
        
            return {
                command: v.replace(/\.[^\.]+$/, ""),
                file: v,
                ...imported.default
            };
        })).then(commands => {
            commands.forEach(command => client.commands.set(command.data.name, command));

            const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

            client.guilds.cache.forEach(async guild => {
                try {
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, guild.id), {
                            body: commands.map(v => v.data.toJSON())
                        }
                    );
                } catch (error) {
                    console.error(error);
                }
            });
        });
    }
}