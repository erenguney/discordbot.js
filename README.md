# discordbot.js

discord.js

https://discord.js.org/#/

npm installnfo


About


discord.js is a powerful node.js module that allows you to interact with the Discord API very easily.

Object-oriented
Predictable abstractions
Performant
100% coverage of the Discord API
Installation
Node.js 8.0.0 or newer is required.
Ignore any warnings about unmet peer dependencies, as they're all optional.

Without voice support: npm install discord.js
With voice support (node-opus): npm install discord.js node-opus
With voice support (opusscript): npm install discord.js opusscript

Audio engines


The preferred audio engine is node-opus, as it performs significantly better than opusscript. When both are available, discord.js will automatically choose node-opus. Using opusscript is only recommended for development environments where node-opus is tough to get working. For production bots, using node-opus should be considered a necessity, especially if they're going to be running on multiple servers.


Optional packages


zlib-sync for significantly faster WebSocket data inflation (npm install zlib-sync)
erlpack for significantly faster WebSocket data (de)serialisation (npm install discordapp/erlpack)
One of the following packages can be installed for faster voice packet encryption and decryption:
sodium (npm install sodium)
libsodium.js (npm install libsodium-wrappers)
uws for a much faster WebSocket connection (npm install uws)
bufferutil for a much faster WebSocket connection when not using uws (npm install bufferutil)


Example usage

const Discord = require('discord.js');

const client = new Discord.Client();


client.on('ready', () => {

  console.log(`Logged in as ${client.user.tag}!`);
  
});

client.on('message', msg => {

  if (msg.content === 'ping') {
  
    msg.reply('pong');
    
  }
});

client.login('token');
