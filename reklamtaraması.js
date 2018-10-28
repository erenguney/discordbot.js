const Discord = require('discord.js');
exports.run = (client, msg, args) => {
 const members = msg.guild.members.filter(member => member.user.presence.game && /(discord\.(gg|io|me|li)\/youtube.com\/.com\/.net\/.tk\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));
 return msg.channel.send(members.map(member => `\`${member.id}\` ${member.displayName}`).join("\n") || "Kimsenin Oynuyor Yerinde **REKLAM** Yok");
};

exports.conf = {
 enabled: true,
 guildOnly: true,
 aliases: ["reklamtaraması", "reklambul", "rtaraması"]
};

exports.help = {
 name: 'reklamtaraması',
 description: 'Oynuyor Yerinde Reklam yapanları gösteir',
 usage: 'reklamtaraması'
};
