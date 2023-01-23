import { SlashCommandBuilder } from "@discordjs/builders";
import asUser from "../utils/asUser.js";

export default {
    data: new SlashCommandBuilder()
        .setName("npcroleplay")
        .setDescription("Send a message as an NPC (Dungeon Master only)")
        .addStringOption(option => option
            .setName("character")
            .setDescription("The NPC to message as")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("content")
            .setDescription("The content of your character's message")
            .setRequired(true)
        ),
    execute: async function(interaction) {
        const userID = interaction.member.id;
        const characterName = interaction.options.getString("character");
        const channel = (await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id, "channels.channelID": interaction.channel.id })).channels.filter(v => v.channelID == interaction.channel.id)?.[0];

        if(!channel) return interaction.reply({ content: "This channel has not been set up for roleplay", ephemeral: true });
        if(channel.dungeonmaster !== userID) return interaction.reply({ content: `This command is only accessible to the Dungeon Master`, ephemeral: true });

        let character = channel.characters.filter(v => v.name === characterName && v.userID === userID)?.[0];

        if(!character) return interaction.reply({ content: `${characterName} was not found`, ephemeral: true });
        
        character.name += ` [NPC]`;

        asUser(interaction.channel, character, { content: interaction.options.getString("content") });
        interaction.reply({ content: "Message sent", ephemeral: true });
    }
}