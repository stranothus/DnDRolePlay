import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("advantage")
        .setDescription("Roll dice with advantage")
        .addStringOption(option => option
            .setName("dice")
            .setDescription("Which type of dice would you like to roll?")
            .addChoices(
                {
                    name: "4 sided",
                    value: "d4"
                },
                {
                    name: "6 sided",
                    value: "d6"
                },
                {
                    name: "8 sided",
                    value: "d8"
                },
                {
                    name: "10 sided",
                    value: "d10"
                },
                {
                    name: "12 sided",
                    value: "d12"
                },
                {
                    name: "20 sided",
                    value: "d20"
                },
            )
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("modifier")
            .setDescription("Set a base modifier to be added or subtracted from the resulting roll")
        ),
    execute: function(interaction) {
        const dice = interaction.options.getString("dice");
        const diceSides = +dice.replace(/d/gi, "");
        const modifier = interaction.options.getInteger("modifier");

        let results = [];

        for(let i = 0; i < 2; i++) {
            results.push(Math.floor(Math.random() * diceSides) + 1);
        }

        const higher = results.sort((a, b) => b - a)[0];

        interaction.reply({ 
            content: `You rolled a ${dice} with advantage and got: ${results.join(", ")} ${modifier < 0 ? "-" : "+"} ${modifier ? Math.abs(modifier) : 0}, choosing ${higher} for a total of ${higher + modifier}`, 
            files: results.map(v => `./dice/d${diceSides}/result_${v}.gif`),
            ephemeral: false 
        });
    }
}