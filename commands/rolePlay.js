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
        let userID = interaction.member.id;
        let character = await global.DB.db("Info").collection("Guilds").findOne({ "characters.userID": userID });

        if(!character) {
            interaction.reply({ content: "You have not created a character yet", ephemeral: true });
            return;
        }
        
        let webhook = await global.DB.db("Info").collection("Guilds").findOne({ channels: interaction.channel.id });

        if(!webhook) {
            interaction.reply({ content: "This channel has not been set up for roleplay", ephemeral: true });
            return;
        }

        asUser(interaction.channel, character.characters.filter(v => v.userID == userID)[0], interaction.options.getString("content"));
        interaction.reply({ content: "Message sent", ephemeral: true });
    }
}