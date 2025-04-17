const { OpenAI } = require("openai");
const fs = require("fs");
require("dotenv/config");

/** @type {Array<{ nome: string, role?: string }>} */
const listaPlayers = JSON.parse(fs.readFileSync("./players.json", "utf8"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

console.log(listaPlayers);

/**
 * @param {string} message - A mensagem enviada pelo usuário.
 * @returns {Promise<string | undefined>} - A resposta do bot.
 */
async function receiveMessage(message) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um bot de Discord para o Time Foda-se. Você ajuda e às vezes faz uma piadinha e um trashtalk com os membros. Dê trashtalk nos players às vezes. Tente evitar mecionar o nome/titulo de quem te fez a pergunta com muita frequencia. Aqui está a lista de jogadores: ${JSON.stringify(listaPlayers)}`,
        },
        { role: "user", content: message },
      ],
      model: "gpt-4o",
      store: true,
    });
    const reply = completion.choices[0].message.content;

    if (reply.length > 2000) {
      const cutReply =
        reply.slice(0, 1930) +
        "\nMensagem cortada pelos limites de caracteres do Discord 😢";
      console.log(cutReply);
      return cutReply;
    }
    console.log(completion.choices[0].message.content);
    return reply;
  } catch (error) {
    console.error("Erro ao processar a resposta.", error);
  }
}

module.exports = receiveMessage;
