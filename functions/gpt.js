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

        if (reply.length > 2000){
            const  cutReply = reply.slice(0,1930) + '\n\Mensagem cortada pelos limites de caracteres do Discord 😢'
            console.log(cutReply)
            return cutReply;
        }
        console.log(completion.choices[0].message.content)
        return reply
    } catch (error) {
        console.error('Erro ao processar a resposta.', error);
    }
}



module.exports = receiveMessage;