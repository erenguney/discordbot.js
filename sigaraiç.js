const Discord = require('discord.js');



exports.run = async (client, message) => {
    let dönme = await message.channel.send({
        embed: {
            color: 0x00AE86,
            description: `${message.author.tag} Sigara içiyor!`,
            image: {
                url: "https://cdn.discordapp.com/attachments/484817922674524171/490206346881400832/NSA7.gif"
            }
        }
    });

    let bitiş = (Math.random() * (60 - 5 +1)) + 5;
    setTimeout(() => {
        dönme.edit({
            embed: {
                color: 0x00AE86,
                description: `${message.author.tag}, Etraf toz duman altında kaldı.`
            }
        });
    }, 5 * 1000);
};  

exports.conf = {
  enabled: true, 
  guildOnly: false, 
  aliases: [],
  permLevel: 0 
};

exports.help = {
  name: 'sigaraiç', 
  description: 'Bu komut ile sigara içebilirsiniz!',
  usage: 'sigaraiç'
};
