import { SlashCommandBuilder } from "@discordjs/builders";
import asUser from "../utils/asUser.js";

export default {
    data: new SlashCommandBuilder()
        .setName("roleplay")
        .setDescription("Send a message as a character")
        .addStringOption(option => option
            .setName("content")
            .setDescription("The content of your character's message")
            .setRequired(true)
        ),
    execute: async function(interaction) {
        const userID = interaction.member.id;
        const channel = interaction.channel.id;
        const guild = await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id });
        const channelDB = guild.channels.filter(v => v.channelID === channel)?.[0];

        if(!channelDB) return interaction.reply({ content: "This channel has not been set up for roleplay", ephemeral: true });
        if(channelDB.dungeonmaster === userID) return interaction.reply({ content: `This command is intended for players. Try /npcroleplay`, ephemeral: true });

        const character = channelDB.characters.filter(v => v.userID === userID)?.[0];

        if(!character) return interaction.reply({ content: `You have not created a character for this channel yet`, ephemeral: true });

        asUser(interaction.channel, character, { content: interaction.options.getString("content") });
        interaction.reply({ content: "Message sent", ephemeral: true });
    }
}