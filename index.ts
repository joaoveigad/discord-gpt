import { Collection, Client, GatewayIntentBits } from "discord.js";
require('dotenv/config');
const fs = require('node:fs');
const path = require('node:path');
const receiveMessage = require('./functions/gpt');

class extendedClient extends Client {
    commands: Collection<string, any>;

    constructor(){
        super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
        this.commands = new Collection(); 
    }
}
const client = new extendedClient();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    console.log(commandsPath);

    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));
    console.log(commandFiles);

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[AVISO] O comando em ${filePath} está faltando uma propriedade "data" ou "execute" necessária.`);
        }
    }
}
client.on("messageCreate", async (message) => {
    if (client.user && message.mentions.users.has(client.user.id)) {
        const cleanMessage = message.content.replace(`<@${client.user.id}>`, "").trim(); // tira o ID do usuário da mention
        const replyGPT = await receiveMessage(cleanMessage);  
        const think = await message.reply('Pensando!'); 
        await think.edit(replyGPT) 
    }
});


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args: any) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args: any) => event.execute(...args));
    }
}


console.log(Client);
client.login(process.env.DISCORD_TOKEN);