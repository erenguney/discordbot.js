const Discord = require('discord.js');
exports.run = function(client, message, args) {
  var request = require('request');
request('http://aws.random.cat/meow', function (error, response, body) {
    if (error) return message.channel.send('Hata:', error);
    else if (!error) {
        var genel = JSON.parse(body);
    }
  const embed = new Discord.RichEmbed()
  .setAuthor(`Kedi`)
  .setColor('RANDOM')
  .setImage(genel.file)
  message.channel.send({embed});
  
});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['kedi'],
  permLevel: 0
};

exports.help = {
  name: 'cat',
  description: 'Kedi Fotoğrafı Atar', 
  usage: 'kedi'
};
