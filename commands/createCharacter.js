import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("createcharacter")
        .setDescription("Create a new character")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the character")
            .setRequired(true)
        ),
    execute: async function(interaction) {
        const userID = interaction.member.id;
        const channel = interaction.channel.id;
        const characterName = interaction.options.getString("name");
        const guild = await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id });
        const channelDB = guild.channels.filter(v => v.channelID === channel)?.[0];

        if(!channelDB) return interaction.reply({ content: `This channel has no campaign`, ephemeral: true });
        if(channelDB.characters.filter(v => v.userID === userID).length && channelDB.dungeonmaster !== userID)  return interaction.reply({ content: `You already have a character in this campaign`, ephemeral: true });
        if(channelDB.characters.filter(v => v.name === characterName).length)  return interaction.reply({ content: `This campaign already has a character named ${characterName}`, ephemeral: true });
        if(characterName.toLowerCase() === "narrator")  return interaction.reply({ content: `You cannot be named the narrator`, ephemeral: true });

        interaction.reply({ content: `Send a picture for your character`, ephemeral: false });

        const collector = interaction.channel.createMessageCollector({
            filter: v => v.author.id === userID && v.attachments.size,
            max: 1,
            time: 1000 * 60
        });
        
        const picture = await new Promise((resolve, reject) => {
            collector.on("collect", v => resolve(v.attachments.first().attachment));
            collector.on("end", (v, reason) => {
                if(reason === "time") return resolve(false);
            });
        });

        if(!picture) return interaction.channel.send("Interaction timed out :( try again");

        
        await global.DB.db("Info").collection("Guilds").updateOne({ guildID: interaction.guild.id, "channels.channelID": channel }, { $push: { "channels.$.characters": {
            userID: userID,
            name: characterName,
            avatar: picture
        }}});
        
        interaction.channel.send(`Character created!`);
    }
}