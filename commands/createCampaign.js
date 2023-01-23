import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("createcampaign")
        .setDescription("Setup a channel for roleplay")
        .addUserOption(option => option
            .setName("dm")
            .setDescription("The Dungeon Master of this channel")
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName("campaignname")
            .setDescription("The campaign's name")
            .setRequired(true)
        )
        .setDefaultPermission(false),
    execute: async function(interaction) {
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: "Only an administrator can setup roleplay channels", ephemeral: true });

        if(await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id, "channels.channelID": interaction.channel.id })) return interaction.reply({ content: `This channel already has a campaign`, epheraml: true });

        const dungeonmaster = interaction.options.getUser("dm").id;

        interaction.reply({ content: `Send a picture for your campaign`, ephemeral: false });

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
        
        await global.DB.db("Info").collection("Guilds").updateOne({ guildID: interaction.guild.id }, { $push: { "channels": {
            channelID: interaction.channel.id,
            dungeonmaster: dungeonmaster,
            campaignpicture: picture,
            campaignname: interaction.options.getString("campaignname"),
            characters: []
        }}});

        interaction.channel.send(`This channel is now a Dungeons and Dragons role play channel with <@${dungeonmaster}> as dungeon master!`);
    }
}