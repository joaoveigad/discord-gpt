// @ts-check

const { Events } = require("discord.js");
const receiveMessage = require("../functions/gpt");

/**
 * @type {{ 
 *   name: string, 
 *   execute: (message: import("discord.js").Message<true>) => Promise<void> 
 * }}
 */
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (
      message.client.user &&
      message.mentions.users.has(message.client.user.id)
    ) {
      const think = await message.reply("Pensando!");
      const cleanMessage = message.content
        .replace(`<@${message.client.user.id}>`, "")
        .trim();

      const author = message.author;

      const replyGPT = await receiveMessage("userId: " + author.id + " userName: " + author.username + " globalName: " + author.globalName + " message:" + cleanMessage);
      await think.edit(replyGPT);
    }
    if (message.content === "!modelo") {
      message.reply(
        "O repositório do modelo deste bot é público! Você pode acessá-lo em: https://github.com/joaoveigad/discord-gpt",
      );
    }
  },
};
