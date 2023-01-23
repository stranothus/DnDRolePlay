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
        const channel = interaction.channel.id;
        const guild = await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id });
        const channelDB = guild.channels.filter(v => v.channelID === channel)?.[0];

        if(!channelDB) return interaction.reply({ content: "This channel has not been set up for roleplay", ephemeral: true });
        if(channelDB.dungeonmaster !== userID) return interaction.reply({ content: `This command is only accessible to the Dungeon Master`, ephemeral: true });

        let character = channelDB.characters.filter(v => v.name === characterName && v.userID === userID)?.[0];

        if(!character) return interaction.reply({ content: `${characterName} was not found`, ephemeral: true });
        
        character.name += ` [NPC]`;

        asUser(interaction.channel, character, { content: interaction.options.getString("content") });
        interaction.reply({ content: "Message sent", ephemeral: true });
    }
}