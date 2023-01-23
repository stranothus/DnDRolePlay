import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("changecampaignimage")
        .setDescription("Change your campaign's image (Dungeon Master only)"),
    execute: async function(interaction) {
        const userID = interaction.member.id;
        const channel = interaction.channel.id;
        const guild = await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id });
        const channelDB = guild.channels.filter(v => v.channelID === channel)?.[0];

        if(!channelDB) return interaction.reply({ content: `This channel has no campaign`, ephemeral: true });
        if(channelDB.dungeonmaster !== userID) return interaction.reply({ content: `This command is only accessible to the Dungeon Master`, ephemeral: true });

        interaction.reply({ content: `Send a new picture for your campaign`, ephemeral: false });

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
        
        await global.DB.db("Info").collection("Guilds").updateOne({ 
            guildID: interaction.guild.id
        }, { 
            $set: { "channels.$[i].campaignimage": picture }
        }, {
            arrayFilters: [{
                "i.channelID": channel
            }]
        });

        interaction.channel.send(`Campaign image updated!`);
    }
}