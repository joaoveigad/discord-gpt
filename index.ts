import { Collection, MessageFlags } from "discord.js";
require('dotenv/config');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');



class extendedClient extends Client {
    commands: Collection<string, any>;

    constructor(){
        super({ intents: GatewayIntentBits.Guilds });
        this.commands = new Collection(); 
    }
}
const client = new extendedClient();

client.once(Events.ClientReady, (readyClient: { user: { tag: any; }; }) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
})



console.log(process.env.DISCORD_TOKEN)      
console.log(process.env.DISCORD_CLIENT_ID)      
console.log(process.env.DISCORD_GUILD_ID)



client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    console.log(`${commandsPath}, lancem a Millia no Strive`)
    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));
    console.log(commandFiles)
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
        }
    }
}

client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`Command ${interaction.commandName} not found`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command.',
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command.',
                flags: MessageFlags.Ephemeral
            });
        }
    }

    console.log(interaction);
});



console.log(Client);
client.login(process.env.DISCORD_TOKEN);