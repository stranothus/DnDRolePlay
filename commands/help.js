import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

const commands = [
    {
        name: "changeAvatar",
        value: "changeavatar",
        embed: interaction => new MessageEmbed()
            .setTitle(`/changeAvatar`)
            .setDescription(`Use this command to change your character's avatar. After inputting your character's name, you'll be prompted to send a new image in the same channel that you used this command in to be your character's new avatar. `)
            .addFields(
                {
                    name: "Name",
                    value: "The name of the character"
                }
            )
            .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
    },
    {
        name: "changeCampaignName",
        value: "changecampaignname",
        embed: interaction => new MessageEmbed()
            .setTitle(`/changecampaignname`)
            .setDescription(`(Dungeon Master only) Change the name of your campaign! This is the name that will show up whenever you narrate for your campaign. `)
            .addFields(
                {
                    name: "Name",
                    value: "The new name for the campaign"
                }
            )
            .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
    },
    {
        name: "changeCampaignPicture",
        value: "changecampaignpicture",
        embed: interaction => new MessageEmbed()
            .setTitle(`/changecampaignpicture`)
            .setDescription(`(Dungeon Master only) Use this command to change the campaign's image. After inputting this command, you'll be prompted to send a new image in the same channel that you used this command in to be your campaign's new image. `)
            .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
    },
    {
        name: "changeName",
        value: "changename",
        embed: interaction => new MessageEmbed()
            .setTitle(`/changename`)
            .setDescription(`Use this command to change your character's name.`)
            .addFields(
                {
                    name: "oldname",
                    value: "The old name of the character"
                },
                {
                    name: "newname",
                    value: "The new name of the character"
                }
            )
            .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
    },
    {
        name: "createCampaign",
        value: "createcampaign",
        embed: interaction => new MessageEmbed()
            .setTitle(`/createcampaign`)
            .setDescription(`(Admin only) Create a new campaign in the same channel that you run this command in. Specify the initial campaign name and the Dungeon Master for the campaign. `)
            .addFields(
                {
                    name: "dm",
                    value: "The Dungeon Master for the campaign"
                },
                {
                    name: "Campaign Name",
                    value: "The name of the campaign"
                }
            )
            .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
    },
    {
        name: "createCharacter",
        value: "createcharacter",
        embed: interaction => new MessageEmbed()
            .setTitle(`/createcharacter`)
            .setDescription(`Create a new character! Normal role players can only have one character, but the Dungeon Master can have as many NPC's as they want. After inputting your character's name, you'll be prompted to send an image in the same channel that you used this command in to be your character's avatar. `)
            .addFields(
                {
                    name: "Name",
                    value: "The name of the character"
                }
            )
            .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
    },
    {
        name: "narrate",
        value: "narrate",
        embed: interaction => new MessageEmbed()
            .setTitle(`/narrate`)
            .setDescription(`(Dungeon Master only) Narrate for your campaign with an embed! `)
            .addFields(
                {
                    name: "Content",
                    value: "The content of your character's message"
                }
            )
            .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
    },
    {
        name: "NPCRolePlay",
        value: "npcroleplay",
        embed: interaction => new MessageEmbed()
            .setTitle(`/npcroleplay`)
            .setDescription(`(Dungeon Master only) Send a message as an NPC. `)
            .addFields(
                {
                    name: "Name",
                    value: "The name of the character"
                },
                {
                    name: "content",
                    value: "The content of your character's message"
                }
            )
            .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
    },
    {
        name: "rolePlay",
        value: "roleplay",
        embed: interaction => new MessageEmbed()
            .setTitle(`/roleplay`)
            .setDescription(`Send a message as your character. Dungeon Master's should use /npcroleplay instead to send messages as NPC's. `)
            .addFields(
                {
                    name: "Content",
                    value: "The content of your character's message"
                }
            )
            .setFooter({ text: "Powered by DnD Role Play bot", iconURL: interaction.client.user.avatarURL() })
    }
];

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Learn how to use me")
        .addStringOption(option => option
            .setName("command")
            .setDescription("What command you want to learn")
            .addChoices(...commands.map(v => ({ name: v.name, value: v.value })))
        ),
    execute: function(interaction) {
        const command = interaction.options.getString("command");

        interaction.reply({ embeds: commands.filter(v => v.value === command).map(v => v.embed(interaction)), ephemeral: true });
    }
}