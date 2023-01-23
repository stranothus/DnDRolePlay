import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("changecampaignname")
        .setDescription("Change your campaign's name (Dungeon Master only)")
        .addStringOption(option => option
            .setName("newname")
            .setDescription("The new name for the campaign")
            .setRequired(true)
        ),
    execute: async function(interaction) {
        const userID = interaction.member.id;
        const channel = interaction.channel.id;
        const name = interaction.options.getString("newname");
        const guild = await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id });
        const channelDB = guild.channels.filter(v => v.channelID === channel)?.[0];

        if(!channelDB) return interaction.reply({ content: `This channel has no campaign`, ephemeral: true });
        if(channelDB.dungeonmaster !== userID) return interaction.reply({ content: `This command is only accessible to the Dungeon Master`, ephemeral: true });
        
        await global.DB.db("Info").collection("Guilds").updateOne({ 
            guildID: interaction.guild.id
        }, { 
            $set: { "channels.$[i].campaignname": name }
        }, {
            arrayFilters: [{
                "i.channelID": channel
            }]
        });
        
        interaction.reply(`Campaign name changed from ${channel.campaignname} to ${name}!`);
    }
}