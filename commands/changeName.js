import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("changename")
        .setDescription("Change your character's name")
        .addStringOption(option => option
            .setName("oldname")
            .setDescription("The old name of the character")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("newname")
            .setDescription("The new name for the character")
            .setRequired(true)
        ),
    execute: async function(interaction) {
        const userID = interaction.member.id;
        const channel = interaction.channel.id;
        const oldname = interaction.options.getString("oldname");
        const newname = interaction.options.getString("newname");
        const guild = await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id });
        const channelDB = guild.channels.filter(v => v.channelID === channel)?.[0];

        if(!channelDB) return interaction.reply({ content: `This channel has no campaign`, ephemeral: true });

        const character = channelDB.characters.filter(v => v.userID === userID && v.name === oldname);

        if(channelDB.characters.filter(v => v.name === newname).length)  return interaction.reply({ content: `This campaign already has a character named ${newname}`, ephemeral: true });
        if(newname.toLowerCase() === "narrator")  return interaction.reply({ content: `You cannot be named the narrator`, ephemeral: true });
        if(!character)  return interaction.reply({ content: `You have no character named ${oldname}`, ephemeral: true });
        
        await global.DB.db("Info").collection("Guilds").updateOne({ 
            guildID: interaction.guild.id
        }, { 
            $set: { "channels.$[i].characters.$[j].name": newname }
        }, {
            arrayFilters: [{
                "i.channelID": channel
            }, {
                "j.name": oldname,
                "j.userID": userID
            }]
        });
        
        interaction.reply(`Character name changed from ${oldname} to ${newname}!`);
    }
}