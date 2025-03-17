const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    async execute(interaction) {
        await interaction.reply(`Your tag: ${interaction.guild.name}\nYour id: ${interaction.guild.memberCount}`);
    },
}