const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js")
const { syncWriteFile, wait } = require("./util.js");
const { fetchLatestPosts } = require("./igClient.js")
const { sites, sitesId } = require("./igClient.js")
require("dotenv").config()
const qrcode = require('qrcode-terminal');


const targetChatId = process.env.chatId


async function startClient() {
    const client = new Client({
        authStrategy: new LocalAuth()
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });
    client.on('message', message => {
        if (message.body === '!ping') {
            client.sendMessage(message.from, 'pong');
        }
        if (message.body === "!info") {
            client.sendMessage(message.from, `          _*Wangsaf Bot*_
    Realtime IG Notifier
    Notifier on IG account:
    - thelazytitip
    - gamertown.id
    - gametech_com
    - consigngaming
    - figureconsign
        
    Author: _Ohsyme_, _Rikunz_`)
        }
        if (message.body === '!bocchi') {
            client.sendMessage(message.from, MessageMedia.fromFilePath("./00021-3286462051.png"));
        }
        if (message.body === '!getId') {
            client.sendMessage(message.from, message.from);
        }
    });
    await client.initialize();
    return client;
}



module.exports = {
    targetChatId,
    startClient
}