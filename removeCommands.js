// import general packages
import { Client } from "discord.js";
import dotenv from "dotenv";

// initiate process.env
dotenv.config();

// initiate the client to the global scope
const client = new Client({
    intents: [
        "GUILDS"
    ]
});

// some general variables to the global scope
const token = process.env.TOKEN;

client.once("ready", () => {
    client.application.commands.fetch()
    .then(commands => {
        commands.forEach(command => {
            client.application.commands.delete(command.id);
        })
    });

    client.guilds.cache.forEach(guild => {
        guild.commands.fetch()
        .then(commands => {
            commands.forEach(command => {
                guild.commands.delete(command.id);
            });
        });
    })
}); // bot startup

client.login(token);