import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Setup a channel for roleplay"),
    execute: async function(interaction) {
        if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            interaction.reply({ content: "Only an administrator can setup roleplay channels", ephemeral: true });
            return;
        }

        await global.DB.db("Info").collection("Guilds").updateOne({ id: interaction.guild.id }, { $push: { "webhooks": interaction.channel.id }});

        interaction.reply("This channel is now a roleplay channel");
    }
}