const { SlashCommandBuilder } = require('@discordjs/builders');
const { OpenAI } = require('openai');
require('dotenv/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Responde usando um modelo da OpenAI API')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input pra AI')
                .setRequired(true)),

    async execute(interaction) {
        const message = interaction.options.getString('input');
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        });

        try {
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: message }],
                model: "gpt-4o-mini",
                store: true,
            });

            // await interaction.reply(completion.choices[0].message.content);
            console.log(completion.choices[0])
            await interaction.reply(completion.choices[0].message.content);

        } catch (error) {
            console.error('Erro gerando resposta:', error);
            await interaction.reply('Houve um erro ao gerar a resposta.');
        }
    }
};
