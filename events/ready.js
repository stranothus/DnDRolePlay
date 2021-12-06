import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dirFlat from "../utils/dirFlat.js";
import discord, { Permissions } from "discord.js";

export default {
    type: "once",
    name: "ready",
    execute: client => {
        console.log("Logged in as " + client.user.tag);

        client.commands = new discord.Collection();
        
        // load commands
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

                // register slash commands
                try {
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, guild.id), {
                            body: commands.map(v => v.data.toJSON())
                        }
                    );
                } catch (error) {
                    console.error(error);
                }

                let setup = (await client.guilds.cache.get(guild.id).commands.fetch()).find(v => v.name === "setup");

                guild.commands.permissions.set({
                    command: setup.id,
                    permissions: guild.members.cache.map(member => member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ? {
                        id: member.user.id,
                        type: "USER",
                        permission: true
                    } : {
                        id: member.user.id,
                        type: "USER",
                        permission: false
                    })
                });
        
                // create a DB document for new servers
                if(!(await global.DB.db("Info").collection("Guilds").findOne({ id: guild.id }))) {
                    global.DB.db("Info").collection("Guilds").insertOne({
                        id: guild.id,
                        characters: [],
                        channels: []
                    });
                }
            });
        });
    }
}