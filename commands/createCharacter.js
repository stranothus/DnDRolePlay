import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("createcharacter")
        .setDescription("Create a new character with a pfp based on yours")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the character")
            .setRequired(true)
        ),
    execute: async function(interaction) {
        let userID = interaction.member.id;

        if(await global.DB.db("Info").collection("Guilds").findOne({ id: interaction.guild.id, "characters.userID": userID })) {
            interaction.reply({ content: "You already have a character in this server", ephemeral: true });
        } else {
            await global.DB.db("Info").collection("Guilds").updateOne({ id: interaction.guild.id }, { $push: { "characters": {
                userID: userID,
                name: interaction.options.getString("name"),
                avatar: interaction.member.user.avatarURL()
            }}});
            interaction.reply({ content: "Character created!", ephemeral: true });
        }
    }
}