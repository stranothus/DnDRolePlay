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
        const channel = interaction.channel.id;
        const guild = await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id });
        const channelDB = guild.channels.filter(v => v.channelID === channel)?.[0];

        if(!channelDB) return interaction.reply({ content: "This channel has not been set up for roleplay", ephemeral: true });
        if(channelDB.dungeonmaster !== userID) return interaction.reply({ content: `This command is only accessible to the Dungeon Master`, ephemeral: true });

        asUser(interaction.channel, {
            name: "Narrator",
            avatar: interaction.client.user.avatarURL()
        }, { 
            embeds: [
                new MessageEmbed()
                    .setTitle(`${channelDB.campaignname} Narration`)
                    .setAuthor({ name: `Dungeon Master: ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
                    .setDescription(interaction.options.getString("content"))
                    .setThumbnail(channelDB.campaignimage)
                    .setTimestamp()
                    .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
            ]
        });
        interaction.reply({ content: "Message sent", ephemeral: true });
    }
}