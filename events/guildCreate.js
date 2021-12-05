export default {
    type: "on",
    name: "guildCreate",
    execute: guild => {
        global.DB.db("Info").collection("Guilds").insertOne({
            id: guild.id,
            characters: [],
            channels: []
        });
    }
}