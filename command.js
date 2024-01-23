const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const client1 = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" })
});
client1.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client1.on('ready', () => {
    console.log('Client is ready!');
});


client1.on('message', message => {
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
client1.initialize();