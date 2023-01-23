export default {
    type: "on",
    name: "guildCreate",
    execute: guild => {
        global.DB.db("Info").collection("Guilds").insertOne({
            guildID: guild.id,
            channels: []
        });
    }
}