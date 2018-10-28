const Discord = require('discord.js');

exports.run = async(client, message, args) => {
if (message.channel.type !== "text") return;
const limit = args[0] ? args[0] : 0;
  if(!limit) {
              var embed = new Discord.RichEmbed()
                .setAuthor('Uygulanan Komut: Slowmode')
                .setDescription(`Slowmode Ayarlamak İçin: !slowmode sayı`)
                .setColor('RANDOM')
            message.channel.send({embed})
            return
          }
if (limit > 120) {
    return message.channel.sendEmbed(new Discord.RichEmbed().setDescription(`Üzgünüm 120'den Fazla Slowmode Olamaz!`).setAuthor('Uygulanan Komut: Slowmode').setColor('RANDOM'));
}
    message.channel.sendEmbed(new Discord.RichEmbed().setDescription(`Artık Slowmode **${limit}** Saniye!`).setAuthor('Uygulanan Komut: Slowmode').setColor('RANDOM'));
var request = require('request');
request({
    url: `https://discordapp.com/api/v6/channels/${message.channel.id}`,
    method: "PATCH",
    json: {
        rate_limit_per_user: limit
    },
    headers: {
        "Authorization": `Bot ${client.token}`
    },
})};
  exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["slow-mode", 'yavaşmod'],
  permLevel: 3,
};

exports.help = {
  name: 'slowmode',
  description: 'Slowmode Ayarlar',
  usage: 'sloqmode',
};
