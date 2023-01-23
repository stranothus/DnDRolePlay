import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("changeavatar")
        .setDescription("Change your character's avatar")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the character")
            .setRequired(true)
        ),
    execute: async function(interaction) {
        const userID = interaction.member.id;
        const channel = interaction.channel.id;
        const name = interaction.options.getString("name");
        const guild = await global.DB.db("Info").collection("Guilds").findOne({ guildID: interaction.guild.id });
        const channelDB = guild.channels.filter(v => v.channelID === channel)?.[0];

        if(!channelDB) return interaction.reply({ content: `This channel has no campaign`, ephemeral: true });

        const character = channelDB.characters.filter(v => v.userID === userID && v.name === name);

        if(!character)  return interaction.reply({ content: `You have no character named ${oldname}`, ephemeral: true });

        interaction.reply({ content: `Send a new picture for your character`, ephemeral: false });

        const collector = interaction.channel.createMessageCollector({
            filter: v => v.author.id === userID && v.attachments.size,
            max: 1,
            time: 1000 * 60
        });
        
        const picture = await new Promise((resolve, reject) => {
            collector.on("collect", v => resolve(v.attachments.first().attachment));
            collector.on("end", (v, reason) => {
                if(reason === "time") return resolve(false);
            });
        });

        if(!picture) return interaction.channel.send("Interaction timed out :( try again");
        
        await global.DB.db("Info").collection("Guilds").updateOne({ 
            guildID: interaction.guild.id
        }, { 
            $set: { "channels.$[i].characters.$[j].avatar": picture }
        }, {
            arrayFilters: [{
                "i.channelID": channel
            }, {
                "j.name": name,
                "j.userID": userID
            }]
        });

        interaction.channel.send(`Avatar updated!`);
    }
}