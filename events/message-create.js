const { Events } = require("discord.js");
const receiveMessage = require("../functions/gpt");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.client.user && message.mentions.users.has(message.client.user.id)) {
            const cleanMessage = message.content
                .replace(`<@${message.client.user.id}>`, "")
                .trim();
            const replyGPT = await receiveMessage(cleanMessage);
            const think = await message.reply("Pensando!");
            await think.edit(replyGPT);
        }
    },
};
