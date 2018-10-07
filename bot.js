const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const { Client, Util } = require('discord.js');
const youtube = new YouTube(GOOGLE_API_KEY);
const queue = new Map();

var prefix = ayarlar.prefix;

client.on('ready', () => {
  console.log(`guney adamdir`);
});

client.on('message', msg => {
  console.log(`LOG: S: ${msg.guild.name} M: ${msg.content} Y: ${msg.author.tag}`);
  if (msg.author.id === ayarlar.id) return;
  if (msg.author.bot) return;

  if (!msg.content.startsWith(prefix)) {
	  return;
  }
  if (msg.content.toLowerCase() === prefix + 'ping') {
    msg.reply(client.ping + ' ms');
  }
  if (msg.content.toLowerCase() === 'sa') {
    msg.reply('Aleyküm selam!');
  }
  if (msg.content.toLowerCase() === prefix + 'yaz') {
    msg.delete();
    msg.channel.sendMessage(msg.content);
  }
  if (msg.content.toLowerCase() === prefix + 'temizle') {
    msg.channel.bulkDelete(100);
    msg.channel.sendMessage("100 adet mesaj silindi!");
  }
  if (msg.content.toLowerCase() === prefix + 'reboot') {
    if (msg.author.id !== ayarlar.sahip) {
      msg.reply('Benim yapımcım değilsin!');
    } else {
      msg.channel.sendMessage(`Bot yeniden başlatılıyor...`).then(msg => {
      console.log(`BOT: Bot yeniden başlatılıyor...`);
      process.exit(0);
    })
   }
  }
});

client.on('message', async msg => {
  if (msg.author.bot) return undefined;
  if (!msg.content.startsWith(prefix)) return undefined;

  const args = msg.content.split(' ');
  const searchString = args.slice(1).join(' ');
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(msg.guild.id);

  let command = msg.content.toLowerCase().split(' ')[0];
  command = command.slice(prefix.length)

  if (command === 'Ã§al') {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.channel.send(':x: Lütfen Sesli Bir Kanala Giriniz.');
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT')) {
      return msg.channel.send(':x: Odaya Girme Yetkim Yok!');
    }
    if (!permissions.has('SPEAK')) {
      return msg.channel.send(':x: Kanalda KonuÅma Yetkim Yok!');
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel.send(`Oynatma Listesi: **${playlist.title}** Listeye Eklendi`);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(searchString, 10);
          let index = 0;
          msg.channel.send(`
__**Sarki Listesi:**__

${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

Hangi ÅarkÄ±yÄ± seÃ§mek istiyorsun? 1-10 Kadar sayÄ± seÃ§.
					`);
          
          try {
            var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
              maxMatches: 1,
              time: 10000,
              errors: ['time']
            });
          } catch (err) {
            console.error(err);
            return msg.channel.send(':x: SÃŒre bitti. Biraz hızlı yaz!');
          }
          const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
        } catch (err) {
          console.error(err);
          return msg.channel.send(':x: Arama sonucunu elde edemedim.');
        }
      }
      return handleVideo(video, msg, voiceChannel);
    }
  } else if (command === 'geÃ§') {
    if (!msg.member.voiceChannel) return msg.channel.send(':x: Sesli Kanalda Değilsin.');
    if (!serverQueue) return msg.channel.send(':x: Şarkı açılamıyor.');
    serverQueue.connection.dispatcher.end(':white_check_mark:  Şarkı atladı.');
    return undefined;
  } else if (command === 'bitir') {
    if (!msg.member.voiceChannel) return msg.channel.send(':x: Sesli Kanala Giriniz.');
    if (!serverQueue) return msg.channel.send(':x: Şarkı açılamıyor..');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end(':white_check_mark:  Başarıyla Durdu');
    return undefined;
  } else if (command === 'ses') {
    if (!msg.member.voiceChannel) return msg.channel.send(':x:  Sesli Kanala Giriniz');
    if (!serverQueue) return msg.channel.send(':x: Şarkı açılamıyor.');
    if (!args[1]) return msg.channel.send(`Åimdiki Ses Durumu: **${serverQueue.volume}**`);
    serverQueue.volume = args[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.send(`Yeni Ses Durumu: **${args[1]}**`);
  } else if (command === 'np') {
    if (!serverQueue) return msg.channel.send(':x: Müzik açılamıyor.');
    return msg.channel.send(`Oynatilan Sarki: **${serverQueue.songs[0].title}**`);
  } else if (command === 'kuyruk') {
    if (!serverQueue) return msg.channel.send(':x: Müzik açılamıyor.');
    return msg.channel.send(`
__**ÅarkÄ± KuyruÄu**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**OynatÄ±lan:** ${serverQueue.songs[0].title}
		`);
  } else if (command === 'dur') {
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return msg.channel.send('Şarkı durdu!');
    }
    return msg.channel.send('Şarkı durdu.');
  } else if (command === 'devam') {
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return msg.channel.send('Tekrar bağlandı!');
    }
    return msg.channel.send(':x: Müzik açılamıyor.');
  }

  return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);
  console.log(video);
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    url: `https://www.youtube.com/watch?v=${video.id}`
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
    queue.set(msg.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(msg.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`:x: Ses Kanalına Giremedim Hata: ${error}`);
      queue.delete(msg.guild.id);
      return msg.channel.send(`:x: Ses Kanalına Giremedim Hata: ${error}`);
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    if (playlist) return undefined;
    else return msg.channel.send(`Oynatma Listesine **${song.title}** İsimli Şarkı Eklendi.`);
  }
  return undefined;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', reason => {
      if (reason === 'Veride sıkıntı var.') console.log('Sarkilar Bitti..');
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  serverQueue.textChannel.send(`:notes: **${song.title}** Adli Sarki Basladi!`);
}

client.login(ayarlar.token);
