const { Client, Discord, MessageAttachment } = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');
const client = new Client();
client.on('ready', () => {
  console.log(`logged as ${client.user.tag} !`);
});
client.login(process.env.TOKEN2);
client.on('message', (msg) => {
  if (msg.content.search('_') !== -1) {
    const MsgArray = msg.content.toLowerCase().split('_');

    if (MsgArray[0] == 'vagabond' && MsgArray[1] < 10) {
      MsgArray[1] = `000${MsgArray[1]}`;
    } else if (MsgArray[1] < 100) {
      MsgArray[1] = `00${MsgArray[1]}`;
    } else if (MsgArray[1] > 100) {
      MsgArray[1] = `0${MsgArray[1]}`;
    }

    const url = `https://mangarabic.com/manga/${MsgArray[0]}/${MsgArray[1]}`;

    console.log(url);
    request(url, (error, resp, html) => {
      const $ = cheerio.load(html);
      const list = [];
      $('.read-container img').each((i, ele) => {
        const item = $(ele).attr('data-src');
        list.push(item);
      });
      if (list.length == 0) {
        msg.channel.send('walo akhay');
      }
      list.map((ele, i) => {
        const attachement = new MessageAttachment(list[i].trim());
        msg.reply(attachement);
        if (i == list.length - 1) {
          msg.channel.send('Done');
          msg.react('👌');
        }
      });
    });
  }
});
