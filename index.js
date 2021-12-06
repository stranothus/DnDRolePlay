import discord from "discord.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dirFlat from "./utils/dirFlat.js";

dotenv.config();

global.client = new discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
        "GUILD_PRESENCES"
    ],
    partials: [
        "CHANNEL"
    ]
});

new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.${process.env.DB_NAME}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err, db) => {
            if(err) console.error(err);

            console.log("DB connected");

            global.DB = db;

            resolve(db);
        }
    );
}).then(DB => {
    Promise.all(dirFlat("./events").map(async v => {
        let imported = await import("./" + v);
    
        return {
            command: v.replace(/\.[^\.]+$/, ""),
            file: v,
            ...imported.default
        };
    })).then(events => events.forEach(event => client[event.type](event.name, event.execute)));
    
    client.login(process.env.TOKEN);
});