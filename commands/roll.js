import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll dice")
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
            .setName("quantity")
            .setDescription("How many dice would you like to roll?")
            .setMinValue(1)
            .setMaxValue(8)
            .setRequired(true)
        ),
    execute: function(interaction) {
        const dice = interaction.options.getString("dice");
        const diceSides = +dice.replace(/d/gi, "");
        const quantity = interaction.options.getInteger("quantity");

        let results = [];

        for(let i = 0; i < quantity; i++) {
            results.push(Math.floor(Math.random() * diceSides) + 1);
        }

        interaction.reply({ 
            content: `You rolled ${quantity} ${dice}'s and got: ${results.join(", ")} for a total of ${results.reduce((a, b) => a + b, 0)}`, 
            files: results.map(v => `./dice/d${diceSides}/result_${v}.gif`),
            ephemeral: false 
        });
    }
}