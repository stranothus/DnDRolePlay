import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import asUser from "../utils/asUser.js";

export default {
    data: new SlashCommandBuilder()
        .setName("narrate")
        .setDescription("Send a message as the narrator")
        .addStringOption(option => option
            .setName("content")
            .setDescription("The narration")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("title")
            .setDescription("The title of the narration")
            .setRequired(false)
        ),
    execute: async function(interaction) {
        let userID = interaction.member.id;
        
        let channel = (await global.DB.db("Info").collection("Guilds").findOne({ id: interaction.guild.id, "channels.channelID": interaction.channel.id })).channels.filter(v => v.channelID == interaction.channel.id)[0];

        if(!channel) {
            interaction.reply({ content: "This channel has not been set up for roleplay", ephemeral: true });
            return;
        } else if(channel.last === userID) {
            interaction.reply({ content: "You just posted", ephemeral: true });
            return;
        } else if(channel.type === 0) {
            interaction.reply({ content: "This is a character only channel", ephemeral: true });
            return;
        }

        let title = interaction.options.getString("title");
        let content = interaction.options.getString("content");

        asUser(interaction.channel, {
            name: "Narrator",
            avatar: interaction.client.user.avatarURL()
        }, {
            embeds: [
                new MessageEmbed()
                    .setColor("#909090")
                    .setTitle(title || "Narration")
                    .setDescription(content)
                    .setFooter("Narration by " + interaction.member.displayName)
            ]
        });

        interaction.reply({ content: "Message sent", ephemeral: true });

        global.DB.db("Info").collection("Guilds").updateOne({ id: interaction.guild.id, "channels.channelID": interaction.channel.id }, { $set: { "channels.$.last": userID }});
    }
}