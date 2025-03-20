const { OpenAI } = require('openai');
require('dotenv/config');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});


async function receiveMessage(message) {

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-4o",
            store: true
        });
        const reply = await completion.choices[0].message.content
        console.log(completion.choices[0].message.content)
        return reply
    } catch (error) {
        console.error('Erro ao processar a resposta.', error);
    }
}



module.exports = receiveMessage;