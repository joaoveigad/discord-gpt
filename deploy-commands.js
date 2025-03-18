require('dotenv/config');
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path')

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON())
        }
        else {
            console.log(`The command in ${filePath} is missing a required 'data' or 'execute' property.`);
        }
    }
}
// console.log(process.env.DISCORD_TOKEN)      
// console.log(process.env.APP_ID)      
// console.log(process.env.SERVER_ID)

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID, process.env.SERVER_ID),
            { body: commands },
        )
        console.log(`Reloaded ${data.length} commands.`);

    } catch (error) {
        console.error(error);
    }
})();