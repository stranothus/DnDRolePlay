import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import asUser from "../utils/asUser.js";

export default {
    data: new SlashCommandBuilder()
        .setName("narrate")
        .setDescription("Narrate for the campaign (Dungeon Master only)")
        .addStringOption(option => option
            .setName("content")
            .setDescription("The content of your character's message")
            .setRequired(true)
        ),
    execute: async function(interaction) {
        const userID = interaction.member.id;
        const channel = (await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id, "channels.channelID": interaction.channel.id })).channels.filter(v => v.channelID == interaction.channel.id)?.[0];

        if(!channel) return interaction.reply({ content: "This channel has not been set up for roleplay", ephemeral: true });
        if(channel.dungeonmaster !== userID) return interaction.reply({ content: `This command is only accessible to the Dungeon Master`, ephemeral: true });

        asUser(interaction.channel, {
            name: "Narrator",
            avatar: interaction.client.user.avatarURL()
        }, { 
            embeds: [
                new MessageEmbed()
                    .setTitle(`${channel.campaignname} Narration`)
                    .setAuthor({ name: `Dungeon Master: ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(interaction.options.getString("content"))
                    .setThumbnail(channel.campaignimage)
                    .setTimestamp()
                    .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
            ]
        });
        interaction.reply({ content: "Message sent", ephemeral: true });
    }
}