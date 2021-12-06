import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup a channel for roleplay")
        .addStringOption(option => option
            .setName("type")
            .addChoice("First person", "1st")
            .addChoice("First person with narrator", "1stw")
            .addChoice("Third person", "3rd")
            .setRequired(false)
            .setDescription("choose a mode for your roleplay")
        ),
    execute: async function(interaction) {
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            interaction.reply({ content: "Only an administrator can setup roleplay channels", ephemeral: true });
            return;
        }

        let type = ["1st", "1stw", "3rd"].indexOf(interaction.options.getString("type"));

        await global.DB.db("Info").collection("Guilds").updateOne({ id: interaction.guild.id }, { $push: { "channels": {
            channelID: interaction.channel.id,
            type: (type + 1) ? type : 0,
            last: 0
        }}});

        interaction.reply("This channel is now a roleplay channel");
    }
}