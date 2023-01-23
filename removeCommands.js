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
        commands.forEach(async command => {
            await Promise.all(commands.map(async command => await client.application.commands.delete(command.id)));

            console.log("Client commands deleted");
        })
    });

    client.guilds.cache.forEach(guild => {
        guild.commands.fetch()
        .then(async commands => {
            await Promise.all(commands.map(async command => await guild.commands.delete(command.id)));

            console.log("Guild commands deleted");
        });
    })
}); // bot startup

client.login(token);