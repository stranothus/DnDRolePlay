import discord from "discord.js";
import dotenv from "dotenv";
import dirFlat from "./utils/dirFlat.js";

dotenv.config();

const client = new discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES"
    ],
    partials: [
        "CHANNEL"
    ]
});

Promise.all(dirFlat("./events").map(async v => {
    let imported = await import("./" + v);

    return {
        command: v.replace(/\.[^\.]+$/, ""),
        file: v,
        ...imported.default
    };
})).then(events => events.forEach(event => client[event.type](event.name, event.execute)));

client.login(process.env.TOKEN);