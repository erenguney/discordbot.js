const Discord = require('discord.js');
exports.run = function(client, message, args) {
  var request = require('request');
request('https://dog.ceo/api/breeds/image/random', function (error, response, body) {
    if (error) return message.channel.send('Hata:', error);
    else if (!error) {
        var genel = JSON.parse(body);
    }
  const embed = new Discord.RichEmbed()
  .setAuthor(`Köpiş`)
  .setColor('RANDOM')
  .setImage(genel.message)
  message.channel.send({embed});
  
});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['köpek'],
  permLevel: 0
};

exports.help = {
  name: 'dog',
  description: 'Köpek Fotoğrafı Atar', 
  usage: 'dog'
};
