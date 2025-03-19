# GPT Discord Bot

Template simples de bot para Discord e comando para fazer a solicitação com um comando slash (/).

Para adicioná-lo ao seu servidor, siga as instruções desta sessão: https://discordjs.guide/preparations/setting-up-a-bot-application.html

Depois de configurado através do .env ou config.json, execute o script 'npm run deploy' para sincronizar os comandos com o seu servidor.

E então, 'npm run up' para fazê-lo ficar online.

Para edição do comando de input, altere o nome de .setName('bot'), para .setName('SEU INPUT AQUI')

Novos comandos devem ser adicionados na pasta /commands/utility e necessariamente contar com a extensão .js

